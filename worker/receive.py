#!/usr/bin/env python
import pika, sys, os, time

def main():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    channel.exchange_declare(exchange='acfirstExchange', exchange_type='fanout')

    result = channel.queue_declare(queue='acfirstQueue', exclusive=True)
    queue_name = result.method.queue
    print(queue_name)

    channel.queue_bind(exchange='acfirstExchange', queue=queue_name)

    print(' [*] Waiting for logs. To exit press CTRL+C')

    # Need to define cases to check for what type of message it is and handle logic on a case by case basisgi
    def callback(ch, method, properties, body):
        print(f" [x] {body}")

    channel.basic_consume(
        queue=queue_name, on_message_callback=callback, auto_ack=True)

    channel.start_consuming()
if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)