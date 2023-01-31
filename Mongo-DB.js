Mongo

db.livros.insertOne({"dataLancamento":{"$date":"2018-04-06T00:00:00.000Z"},"nome":"Philosophy of Software Design","preco":139.40,"categoria":"Computação"})
db.clientes.insertOne({"documento":"07893159049","nome":"Pedro Gomes","telefone":"51984501509","PJ":false,"enderecos":[{"rua":"Rua Rino Levi","numero":255,"complemento":"Cobertura","bairro":"Barra da Tijuca","cep":90570590,"cidades_id":{"$oid":"63d2dce09e760c94fdd173bd"}}]});
db.pedidos.insertOne({"dataEmissao":{"$date":"2023-01-27T00:00:00.000Z"},"idCliente":{"$oid":"63d464748bd529b953ff6479"},"itensPedido":[{"quantidade":2,"valorUnitario":139.40,"idLivro":{"$oid":"63d464238bd529b953ff6478"}}]})


db.pedidos.find({"dataEmissao" : {$gte:ISODate("2021-01-01")}})
db.pedidos.find({"dataEmissao" : {$gte:ISODate("2023-01-01"),$lt:ISODate("2023-01-27")}})



[{
    $lookup:
      {
        from: "livros",
        localField: "itensPedido.idLivro",
        foreignField: "_id",
        as: "livros"
      }
  }]




  
  [{
    $lookup:
      {
        from: "livros",
        localField: "itensPedido.idLivro",
        foreignField: "_id",
        as: "livros"
      }
  },{
    $lookup:
      {
        from: "clientes",
        localField: "idCliente",
        foreignField: "_id",
        as: "cliente"
      }
  }]



  [{
    $lookup:
      {
        from: "livros",
        localField: "itensPedido.idLivro",
        foreignField: "_id",
        as: "livros"
      }
  },{
    $lookup:
      {
        from: "clientes",
        localField: "idCliente",
        foreignField: "_id",
        as: "cliente"
      }
  }, 
  {
    "$project": { 
      "nomeCliente" :  "$cliente.nome",
      "quantidade" : {"$arrayElemAt": [ "$itensPedido.quantidade", 0 ]},
      "valorTotal" : {"$multiply" : [{"$arrayElemAt": [ "$itensPedido.valorUnitario", 0 ]}, {"$arrayElemAt": [ "$itensPedido.quantidade", 0 ]}]}
  
    } }]


[{
  $lookup:
    {
      from: "livros",
      localField: "itensPedido.idLivro",
      foreignField: "_id",
      as: "livros"
    }
},{
  $lookup:
    {
      from: "clientes",
      localField: "idCliente",
      foreignField: "_id",
      as: "cliente"
    }
}, 
{
  "$project": { 
    "nomeCliente" :  "$cliente.nome",
    "quantidade" : {"$arrayElemAt": [ "$itensPedido.quantidade", 0 ]},
    "valorTotal" : {"$multiply" : [{"$arrayElemAt": [ "$itensPedido.valorUnitario", 0 ]}, {"$arrayElemAt": [ "$itensPedido.quantidade", 0 ]}]}

  } },
{ $group: {
 "_id": {
  "nomeCliente": "$nomeCliente"
 },
 "valorGasto": {
  "$sum": "$valorTotal"
}
}}, 
{
  "$sort": {
    "valorGasto": -1
  }
}]

[{
    $lookup:
      {
        from: "livros",
        localField: "itensPedido.idLivro",
        foreignField: "_id",
        as: "livros"
      }
  },{
    $lookup:
      {
        from: "clientes",
        localField: "idCliente",
        foreignField: "_id",
        as: "cliente"
      }
  }, 
  {
    "$project": { 
      "nomeCliente" :  "$cliente.nome",
      "quantidade" : {"$arrayElemAt": [ "$itensPedido.quantidade", 0 ]},
      "valorTotal" : {"$multiply" : [{"$arrayElemAt": [ "$itensPedido.valorUnitario", 0 ]}, {"$arrayElemAt": [ "$itensPedido.quantidade", 0 ]}]}
  
    } },
  { $group: {
   "_id": {
    "nomeCliente": "$nomeCliente"
   },
   "valorGasto": {
    "$sum": "$valorTotal"
  }
  }},
  {
    $match: {"valorGasto" : {$gt: 200}}
 }
  ]