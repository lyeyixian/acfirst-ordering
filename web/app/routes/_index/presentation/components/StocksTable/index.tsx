import { Form, useFetcher, useNavigation } from '@remix-run/react'
import { useState, useEffect, useRef } from 'react';
import { Button, Card, Container, Flex, Group, Modal, NumberInput, Text,Title } from '@mantine/core'
import { CartItem, EventType, Stock, StockRowData } from '~/common/type'
import classes from './CartItem.module.css'

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { useDisclosure } from '@mantine/hooks';
import { GridReadyEvent, RowNode } from 'ag-grid-community';


export function StocksTable({ stocks }: { stocks: Stock[] }) {
  const refreshStocksFetcher = useFetcher()

  const [opened, { open, close }] = useDisclosure(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalCost, setTotalCost] = useState(0)
  const navigation = useNavigation()

  // Grid Stuff
  const gridRef = useRef();
  const numberSort = (num1: number, num2: number) => {
    return num1 - num2;
  };
  const onGridReady = (params: GridReadyEvent) => {
    params.api.resetRowHeights();
  }
  const checkboxSelection = (params: RowNode) => {
    if (params.data.Quantity > 0) {
       return true;
    }
    return false;
  }
  const rowStyle = (params: RowNode) => {
      if (params.data.Quantity <= 0){
          return { background: '#f58484' };
        }
    }

  const [rowData, setRowData] = useState<StockRowData[]>([])
  const [colDefs, setColDefs] = useState([
    { field: "Item Code", filter: 'agTextColumnFilter', checkboxSelection: checkboxSelection, headerCheckboxSelection: true, lockPosition: "left"},
    { field: "Batch", filter: 'agTextColumnFilter' },
    { field: "Location", filter: 'agTextColumnFilter' },
    { field: "Quantity", filter: 'agNumberColumnFilter', sortable: true, comparator: numberSort},
    { field: "Price per Unit (MYR)", filter: 'agNumberColumnFilter', sortable: true, comparator: numberSort}
  ]);

  useEffect(() => {
    const rows: StockRowData[] = [];
    stocks.map((data) => {
      rows.push({"Item Code": data.itemCode, "Batch": data.batch, "Location": data.location, "Quantity": data.quantity, "Price per Unit (MYR)": data.pricePerUnit})
    })
    setRowData(rows)
  }, [stocks]);


  const onSelectionChanged = () => {
    const selectedRows: StockRowData[] = gridRef.current?.api.getSelectedNodes().map((node: RowNode) => node.data)
    const selectedItems: CartItem[] = []
    selectedRows.forEach(item => {
      const cartItem: CartItem = {
        currentQuantity: cartItems.filter(existingItem => isSameStockItem(existingItem, item)).pop()?.currentQuantity ?? 1, //Set 1 to be default selected quantity
        stock: {
          itemCode: item['Item Code'],
          location: item.Location,
          batch: item.Batch,
          pricePerUnit: item['Price per Unit (MYR)'],
          quantity: item.Quantity,
          updatedAt: undefined
        }
      }
      selectedItems.push(cartItem)
    })
    setCartItems(selectedItems);
  };

  useEffect(() => {
    let cost = 0
    cartItems.forEach(item => {
      cost += item.currentQuantity*item.stock.pricePerUnit
    })
    setTotalCost(cost);
  }, [cartItems, setCartItems])

  const isSameStockItem = (item1: CartItem, item2: StockRowData) => {
    return item1.stock.itemCode === item2['Item Code'] &&
            item1.stock.location === item2.Location &&
            item1.stock.batch === item2.Batch
  }
  
  const calculateTotalCost = () => {
    let cost = 0
    cartItems.forEach(item => {
      cost += item.currentQuantity*item.stock.pricePerUnit
    })
    setTotalCost(cost);

  }

  const zeroQuantityItemExist = () => {
    if (cartItems.length === 0) return true
    for (let i=0; i < cartItems.length; i++) {
      if (cartItems[i].currentQuantity <= 0) return true;
    }
    return false;
  }

  return (
    <Container size={1080}>
      <Flex mb={10} justify={"space-between"}>
        <Title order={2}>Stocks</Title>
        <refreshStocksFetcher.Form method="post">
          <input type="hidden" name="type" value={EventType.REFRESH_STOCKS} />
          <Button ml={10} mt={5} type="submit">
            Refresh Stocks
          </Button>
        </refreshStocksFetcher.Form>
      </Flex>
      <div
        className="ag-theme-quartz" // applying the grid theme
        style={{ height: 700, width: "100%"}} // the grid will fill the size of the parent container
      >
        <AgGridReact
            onGridReady={onGridReady}
            ref={gridRef}
            rowData={rowData}
            columnDefs={colDefs}
            pagination={true}
            paginationAutoPageSize={true}
            enableCellTextSelection
            rowSelection={"multiple"}
            suppressRowClickSelection={true}
            rowHeight={35}
            onSelectionChanged={onSelectionChanged}
            getRowStyle={rowStyle}
        />
      </div>
      <Flex justify={"right"}>
        <Button mt="md" onClick={open} disabled={cartItems.length<1}>
          Add {cartItems.length !== 0 ? cartItems.length : "" } Items to Cart
        </Button>
        <Modal opened={opened} onClose={close} title="Add to Cart" size={'xl'}>
          <Form method="post">
            {cartItems.map((item, key) => {
              return (
                <Card key={key} className={classes.card} shadow='sm' withBorder mb='sm'>
                  <Flex justify={'space-between'}>
                    <Group>
                      <div style={{ flex: 1 }}>
                        <input name='itemCode' type='hidden' value={item.stock.itemCode}/>
                        <input name='location' type='hidden' value={item.stock.location}/>
                        <input name='batch' type='hidden' value={item.stock.batch}/>
                        <input name='pricePerUnit' type='hidden' value={item.stock.pricePerUnit}/>
                        <input name='quantity' type='hidden' value={item.stock.quantity}/>
                        <Text size="sm" fw={500}>
                          {item.stock.itemCode}
                        </Text>
                        <Text c="dimmed" size="sm">
                          {item.stock.location}
                        </Text>
                        <Text c="dimmed" size="sm">
                          {item.stock.batch}
                        </Text>
                      </div>
                    </Group>
                    <Flex>
                        <div style={{ flex: 1 }}>
                        <Group>
                          <Text size="sm" mr="md" fw={500}> Cost: </Text>
                          <Text>{item.currentQuantity * item.stock.pricePerUnit}</Text>
                        </Group>
                        <Text size="xs"> Price per unit: {item.stock.pricePerUnit}</Text>
                        </div>
                    </Flex>
                    <Flex>
                      <Group>
                        <div style={{ flex: 1 }}>
                        <Text size="sm" mr="md" fw={500}> Quantity: </Text>
                        <Text size="sm"> Max: {item.stock.quantity}</Text>
                        </div>
                      </Group>
                      <NumberInput
                        name='currentQuantity'
                        withAsterisk
                        min={1}
                        max={item.stock.quantity}
                        defaultValue={item.currentQuantity}
                        allowDecimal={false}
                        clampBehavior="strict"
                        stepHoldDelay={500}
                        stepHoldInterval={100}
                        onValueChange={(value)=> {
                          if (value.floatValue === undefined) {
                            item.currentQuantity = 0
                          } else {
                            item.currentQuantity=value.floatValue
                          }
                          calculateTotalCost()
                        }}
                      />
                    </Flex>
                </Flex>
              </Card>
              )
            })}
              <Container className={classes.footerContainer} mt='md' >
              <Flex justify={'right'}>
                <Text fw={500}>Total Cost: {totalCost} MYR</Text>
                <Button variant="outline" onClick={close} mx="md">
                      Cancel                            
                </Button>
                <Button type="submit" variant="filled" mx="md" disabled={zeroQuantityItemExist()} onClick={close}>
                  {navigation.state === 'idle' ? 'Add to Cart' : 'Adding...'}         
                </Button>
              </Flex>
              {zeroQuantityItemExist() ? (
                <Text mx={'md'} mt={'md'} className={classes.zeroQuantityText} size='sm' c={'red'}>
                  You must have at least 1 quantity for each item
                </Text>
              ) : ""}
              </Container>
          </Form>
        </Modal>
      </Flex>
    </Container>
  )
}

