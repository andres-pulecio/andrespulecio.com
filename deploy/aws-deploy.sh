#!/bin/dash
echo "********************* Docker build Personal Registry *********************"
docker build . -t andrespulecio/my-portfolio
echo "********************* Docker push Personal Registry *********************"
docker push andrespulecio/my-portfolio:latest
echo "********************* Login AWS Registry *********************"
token=`aws ecr-public get-login-password --region us-east-1`
docker login --username AWS --password $token public.ecr.aws/z6s0c3o0
echo "********************* npm build *********************"
npm run build
echo "********************* Build docker image *********************"
docker build -t my-porfolio .
echo "********************* Tag docker image *********************"
docker tag my-porfolio:latest public.ecr.aws/z6s0c3o0/my-porfolio:latest
echo "********************* Push image *********************"
docker push public.ecr.aws/z6s0c3o0/my-porfolio:latest
