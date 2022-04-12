#!/bin/bash

# azureの初期イメージ(Ubuntu20.04 LTS)から競技環境用イメージ作成のためにいろいろインストールするスクリプト
# 競技用イメージの作成に使用する。

# install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get -y update
apt-get -y install docker-ce docker-ce-cli containerd.io

# install docker-compose
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose --version

# for front build
curl -L git.io/nodebrew | perl - setup
echo "export PATH=$HOME/.nodebrew/current/bin:$PATH" >> ~/.bashrc
(/root/.nodebrew/current/bin/nodebrew install-binary v16.14.0 && /root/.nodebrew/current/bin/nodebrew use v16.14.0)

# 負荷試験ツール
sudo apt update
apt install -y python3
apt install -y python3-pip
pip install locust


# init directory
mkdir ./baseCSV

mkdir /da
mkdir /da/repo
mkdir /da/tls
mkdir /da/file
mkdir /da/file/static

cp ./entry.sh ~/

echo "xxxx" > /da/funcKey