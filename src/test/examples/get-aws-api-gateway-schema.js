export async function getAwsApiGatewaySchema (
  waychaser,
  gatewayName,
  schemaName
) {
  const api = await waychaser(
    'https://apigateway.ap-southeast-2.amazonaws.com/restapis'
  )
  const gateway = await api.ops
    .filter('item')
    .findInRelated({ name: gatewayName })
  const models = await gateway.invoke(
    'http://docs.aws.amazon.com/apigateway/latest/developerguide/restapi-restapi-models.html'
  )
  const model = await models.ops
    .filter('item')
    .findInRelated({ name: schemaName })
  return JSON.parse(model.content.schema)
}
