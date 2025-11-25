from socket import *

clientSock = socket(AF_INET, SOCK_STREAM)
clientSock.connect(("127.0.0.1", 8080))

print("접속 완료")
clientSock.send("i im a client".encode("utf-8"))

print("메세지를 전송 하였습니다.")

data = clientSock.recv(1024)
print ("받은 데이터 : ", data.decode("utf-8"))