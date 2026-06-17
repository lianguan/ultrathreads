FROM golang:1.15-alpine3.12 AS builder

RUN go version

COPY . /github.com/ultrathreads/ultrathreads-backend/
WORKDIR /github.com/ultrathreads/ultrathreads-backend/

RUN go mod download
RUN GOOS=linux go build -o ./.bin/app ./main.go

FROM alpine:latest

WORKDIR /root/

COPY --from=0 /github.com/ultrathreads/ultrathreads-backend/.bin/app .
COPY --from=0 /github.com/ultrathreads/ultrathreads-backend/configs configs/
COPY --from=0 /github.com/ultrathreads/ultrathreads-backend/templates templates/

CMD ["./app"]