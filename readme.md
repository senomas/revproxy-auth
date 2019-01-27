## BUILD

```
docker build . -t senomas/revproxy-auth:1.0.1
docker push senomas/revproxy-auth:1.0.1
```

## CREATE KEY PAIR

```
docker run senomas/revproxy-auth:1.0.1
```

## RUNNING

```
docker run -e PUBLIC_KEY=<PUBLIC_KEY> -e validIAT=0 -e TARGET=http://xxxxxxxx/ senomas/revproxy-auth:1.0.1
```

## GENERATE TOKEN

```
http://xxxxxxx/auth?user=john&key=<PRIVATE_KEY>
```

with expiry (in hours)

```
http://xxxxxxx/auth?user=john&key=<PRIVATE_KEY>&expiry=1
```