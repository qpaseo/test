from socket import *
import threading
import time

def send(sock): 
    while True:
        sendData = input(">>>")
        sock.send(sendData.encode("utf-8"))

def receive(sock): 
    while True:
        recvData = sock.recv(1024)
        print("상대방 : ", recvData.decode("utf-8"))

port = 8081
serverSock = socket(AF_INET, SOCK_STREAM)
serverSock.bind(('', port))
serverSock.listen(1)

print("%d 번 포트로 접속 대기중", port)

conn