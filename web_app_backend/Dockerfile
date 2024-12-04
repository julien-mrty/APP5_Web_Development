# Build stage
FROM golang:1.23 AS builder
WORKDIR /app

# Copy the go.mod and go.sum first to take advantage of Docker cache
COPY go.mod ./
COPY go.sum ./

# Fetch dependencies and tidy up the go.mod file
RUN go mod tidy

# Copy the rest of your application
COPY . . 

# Build your application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Run stage
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
RUN chmod +x ./main  # Ensure the binary is executable
EXPOSE 8081
CMD ["./main"]