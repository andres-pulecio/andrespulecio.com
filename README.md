# Threejs Car Physics
This project is to practice three.js, 
This example demonstrates,

- Using Cannon.js as the Physics engine.
- Using CANNON.HingeConstraint to simulate wheel axels, engine and suspension.
- Implementing a follow camera using Vector3.lerpVectors.
- Shadows using the Directional Light Shadow and Helper.
- Using Keyboard events to control the car.
- Using the Cannon.js Debug Renderer

## How to execute?
After downloading the repository, execute `npm install` once in the root directory to install all dependencies.

To build `npn run build`

You can then start a local server by using `npm start` and open `http://localhost:3000/app/` for testing.

## How to execute with Docker?

- To buil execute:
```sh
docker build . -t andrespulecio/my-portfolio
```
- You can then start a container by using:
```sh
docker run -p 8081:3000 -d andrespulecio/my-portfolio
```
and open `http://localhost:8081/app/` for testing.

- Push to DockerHub
```sh
docker push andrespulecio/my-portfolio:latest
```

## How to deploy on AWS?
- Get AWS token
```sh
aws ecr-public get-login-password --region us-east-1
```
- Login to ECR(Elastic Container Registry) on AWS
```sh
docker login --username AWS --password <TOKEN aws>  public.ecr.aws/z6s0c3o0
```
- Build docker image
```sh
docker build -t my-porfolio .
```
- Tag docker image
```sh
docker tag my-porfolio:latest public.ecr.aws/z6s0c3o0/my-porfolio:latest
```
- Push image
```sh
docker push public.ecr.aws/z6s0c3o0/my-porfolio:latest
```

- Update task in Cluster(ECR), open [myPortfolioCluster/tasks](https://us-east-1.console.aws.amazon.com/ecs/home?region=us-east-1#/clusters/myPortfolioCluster/tasks) 

- open [andres.pulecio.io](http://ec2-35-153-102-108.compute-1.amazonaws.com:8888/app/)