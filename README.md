<h1 align="center">
  FlamIncome TLV PubSub
  <br>
</h1>

<h4 align="center">Pubsub bot that notifies you whenever FlamIncome's TLV changes</h4>

## Using it
Just establish a connection to the websockets URL and you'll start receiving messages.

## Hosting your own
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Development
This project uses the standards widely known on the javascript community:
```
export ALCHEMY_TOKEN="XXXXXXX"
npm install # Install dependencies
npm run build # Compile typescript code
npm run lint # Lint & format code
npm start # Start the server
```
