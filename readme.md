## BUILD

```
docker build . -t senomas/revproxy-auth:1.0.3
docker push senomas/revproxy-auth:1.0.3
```

## CREATE KEY PAIR

```
docker run senomas/revproxy-auth
```

## RUNNING

```
docker run -e PUBLIC_KEY=<PUBLIC_KEY> -SERVICE=demo -e validIAT=0 -e TARGET=http://xxxxxxxx/ senomas/revproxy-auth
```

## GENERATE TOKEN

```
http://xxxxxxx/auth?user=john&key=<PRIVATE_KEY>
```

with expiry (in hours)

```
http://xxxxxxx/auth?user=john&key=<PRIVATE_KEY>&expiry=1
```