var json = require("./broken-database.json");
var jsonProducts = require("./produtos.json");
var fs = require("fs");

//Recuperação dos dados originais do banco de dados

function setPriceInt(key, value) {
  if (key === "price") {
    return parseInt(value);
  }
  return value;
}
var stringified = JSON.stringify(json, setPriceInt);

stringified = stringified
  .replace(/æ/g, "a")
  .replace(/&/g, "e")
  .replace(/¢/g, "c")
  .replace(/ø/g, "o")
  .replace(/ß/g, "b");

var jsonObject = JSON.parse(stringified);

jsonObject.forEach(function (data, index) {
  if (!data.quantity) {
    jsonObject[index].quantity = 0;
  }
});
fs.writeFile("resolucao.json", JSON.stringify(jsonObject), function (err) {
  if (err) throw err;
  console.log("Resolução JSON Criada com Sucesso!");
});

// Validação do banco de dados corrigido

keys = ["category"]; //trecho de código da internet, pesquisei uma forma de deixar um json em forma alfabética baseado em um elemento do objeto no caso category
jsonObject.sort(function (a, b) {
  var ret = 0,
    i = 0;
  while (ret == 0 && i < keys.length) {
    ret = a[keys[i]] > b[keys[i]] ? 1 : a[keys[i]] < b[keys[i]] ? -1 : 0;
    i++;
  }
  return ret;
});

const indexedJson = jsonObject.map((item, index) =>
  Object.assign(item, { index })
);

// a) Uma função que imprime a lista com todos os nomes dos produtos...

function ImprimirProdutos() {
  console.log(indexedJson);
  fs.writeFile("saida.json", JSON.stringify(indexedJson), function (err) {
    if (err) throw err;
    console.log("Saida JSON Criada com Sucesso!");
  });
}
ImprimirProdutos();

// b) Uma função que calcula qual é o valor total do estoque por categoria...

function CalcularValorEstoque() {
  indexedJson.forEach(function (data) {
    jsonProducts.forEach(function (product) {
      if (data.category === product.category) {
        product.totalPrice += data.price * data.quantity;
      }
    });
  });
  fs.writeFile(
    "saida-produtos-estoque.json",
    JSON.stringify(jsonProducts),
    function (err) {
      if (err) throw err;
      console.log("Produtos JSON Atualizado com Sucesso!");
    }
  );
}
CalcularValorEstoque();
