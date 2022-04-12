#!/bin/bash
#==================================
# VM環境をテンプレートから生成するスクリプト。
# azコマンドが対象のサブスクリプションで利用できる必要がある。
# DNSの設定は手動で行う必要がある
# usage ./CreateVM [subscriptionId] [resourceGroupName] [envId]
#==================================

if [ $# != 3 ]; then
    echo "予期せぬ引数"
    exit 1
fi

subscriptionId=$1
rgname=$2
id=$3

token=`az account get-access-token --subscription ${subscriptionId} --query 'accessToken' -o tsv`

cat arm-template.json | sed s/__name__/${id}/ > target.json

curl -X PUT -H 'content-type: application/json' -H "Authorization: Bearer ${token}" -d @target.json \
"https://management.azure.com/subscriptions/${subscriptionId}/resourcegroups/${rgname}/providers/Microsoft.Resources/deployments/env-provisioning?api-version=2019-05-01"

rm target.json
