import { useFetcher } from '@remix-run/react'
import { useState, useEffect, useRef } from 'react';
import { Button, Card, Container, Flex, Group, Modal, NumberInput, Text,Title } from '@mantine/core'
import { EventType, Stock, StockRowData } from '~/common/type'
import classes from './CartItem.module.css'

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { useDisclosure } from '@mantine/hooks';
import { GridReadyEvent, RowNode } from 'ag-grid-community';

export function StocksTable({ stocks }: { stocks: Stock[] }) {
  const numberSort = (num1: number, num2: number) => {
    return num1 - num2;
  };

  const refreshStocksFetcher = useFetcher()

  const gridRef = useRef();

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

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedItems, setSelectedItems] = useState<StockRowData[]>([])

  useEffect(() => {
    const rows: StockRowData[] = [];
    stocks.map((data) => {
      rows.push({"Item Code": data.itemCode, "Batch": data.batch, "Location": data.location, "Quantity": data.quantity, "Price per Unit (MYR)": data.pricePerUnit})
    })
    setRowData(rows)
  }, [stocks]);


  const onSelectionChanged = () => {
    setSelectedItems(gridRef.current?.api.getSelectedNodes().map((node: RowNode) => node.data));
  };
  

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
        <Button mt="md" onClick={open} disabled={selectedItems.length<1}>
          Add {selectedItems.length !== 0 ? selectedItems.length : "" } Items to Cart
        </Button>
        <Modal opened={opened} onClose={close} title="Add to Cart" size={'xl'}>
          <Container>
            {selectedItems.map((item, key) => {
              return (
                <Card key={key} className={classes.user} shadow='sm' withBorder mb='sm'>
                  <Flex justify={'space-between'}>
                    <Group>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" fw={500}>
                          {item['Item Code']}
                        </Text>
                        <Text c="dimmed" size="sm">
                          {item.Location}
                        </Text>
                        <Text c="dimmed" size="sm">
                          {item.Batch}
                        </Text>
                      </div>
                    </Group>
                    <Flex>
                      <Group>
                        <div style={{ flex: 1 }}>
                        <Text size="sm" mr="md" fw={500}> Quantity: </Text>
                        <Text size="sm"> Max: {item.Quantity}</Text>
                        </div>
                      </Group>
                      <NumberInput
                        withAsterisk
                        min={1}
                        max={item.Quantity}
                        allowDecimal={false}
                        clampBehavior="strict"
                        stepHoldDelay={500}
                        stepHoldInterval={100}
                      />
                    </Flex>

                </Flex>
              </Card>
              )
            })}
            <Flex mt='md' justify={'right'}>
              <Button variant="outline" onClick={close} mx="md">
                    Cancel                            
              </Button>
              <Button type="submit" variant="filled" mx="md">
                  Add Items                            
              </Button>
            </Flex>
          </Container>
        </Modal>
      </Flex>
    </Container>
  )
}
