#!/bin/bash

pip3 install undetected-chromedriver

page_source=$(python3 << EOF
import undetected_chromedriver.v2 as uc
import time
driver = uc.Chrome(delay=10,port=9515)
with driver:
    driver.get('https://techblog.willshouse.com/2012/01/03/most-common-user-agents/')
    time.sleep(10)
    print(driver.page_source)
EOF
)

echo "$page_source" | tr -d '\n' | sed -E 's/.*JSON.+\[\{/\[\{/' | sed -E 's/\}\].*/\}\]/' > ua.json
