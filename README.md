## Development

### Set up

#### Environment variables
```shell
DIRECTORY_PATH=./data
LLAMA_MODEL=./model.bin
```

#### Data directory
Add markdown files to a folder named `data`
```shell
mkdir data
cp /whatever/the/markdown/file/you/want/to.md ./data/
```

#### Model file
Add the embedding Llama model as a `model.bin` file
```shell
cp /whatever/the/llama/model/you/want/to.bin ./model.bin
```

#### Build server
```shell
yarn build
```

#### Start server
```shell
yarn start
```

#### Start Chroma
```shell
git clone git@github.com:chroma-core/chroma.git
cd chroma
docker-compose up -d --build
```
