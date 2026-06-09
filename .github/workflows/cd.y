name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.AWS_HOST }}
          username: ${{ secrets.AWS_USER }}
          key: ${{ secrets.AWS_SSH_KEY }}
          script: |
            cd /var/www/clack
            git pull origin main
            pnpm install --frozen-lockfile
            pnpm turbo build
            pm2 restart clack-web

#GitHub

#GitHub Actions

#Docker Build

#ECR

#ECS Fargate

#ALB
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    permissions:
      contents: read

    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - uses: aws-actions/amazon-ecr-login@v2

      - name: Build image
        run: |
          docker build -t ${{ secrets.ECR_REPOSITORY }} .

      - name: Tag image
        run: |
          docker tag ${{ secrets.ECR_REPOSITORY }}:latest \
          ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/${{ secrets.ECR_REPOSITORY }}:latest

      - name: Push image
        run: |
          docker push \
          ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/${{ secrets.ECR_REPOSITORY }}:latest

      - name: Deploy ECS
        run: |
          aws ecs update-service \
            --cluster ${{ secrets.ECS_CLUSTER }} \
            --service ${{ secrets.ECS_SERVICE }} \
            --force-new-deployment