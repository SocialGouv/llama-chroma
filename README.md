## API

#### Index data
```
GET /api/indexing
```

#### Get text embeddings
```
GET /api/embeddings?text=hello
```

#### Get related data from query
```
GET /api/query?text=hello
```

#### Get collection information
```
GET /api/info
```

#### Delete collection
```
DELETE /api/collection
```

## Development

### Set up

#### Environment variables
Add a `.env` like so:
```shell
DIRECTORY_PATH=./data
LLAMA_MODEL=./model.bin
CHROMA_URL=http://localhost:8000
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

### Test

#### Call /api/indexing
```shell
curl localhost:3000/api/indexing -v
```
