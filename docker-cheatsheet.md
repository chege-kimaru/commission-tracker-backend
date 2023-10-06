### Build
```
docker build -t commission-tracker .
```

### Run container
- `-d` to Run container in the background
```
docker run -p 4700:4700 -d commission-tracker
```

- `-it` to Run container in interactive mode
```
docker run -p 4700:4700 -it commission-tracker
```

- `--net=host` to use host's network. No need for port mapping using `-p`
```
docker run --net=host -it commission-tracker
```

- Note, in windows if you are not using `--net=host` use `host.docker.internal` in place of `localhost`. On Linux however, you have to add this host manually when running using `--add-host=host.docker.internal:host-gateway`. `host-gateway` is usually `172.17.0.1` but already set on Docker for newer docker versions.
```
docker run -p 4700:4700 -it --add-host=host.docker.internal:host-gateway commission-tracker
```

- Use this for deployment
```
docker run --net=host -d --env-file .env  commission-tracker
```

### View containers
```
docker ps -a
```

### Start container
```
docker start containerId
```

### Restart container
```
docker restart containerId
```
```
docker restart 6bfd89314602
```

### Remove containers
```
docker rm containerId containerId d30399a75c91
```