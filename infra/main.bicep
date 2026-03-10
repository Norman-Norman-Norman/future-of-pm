targetScope = 'subscription'

@description('Name of the environment (used for resource naming)')
param environmentName string

@description('Primary location for all resources')
param location string

@description('Name of the resource group')
param resourceGroupName string = 'rg-${environmentName}'

// Resource Group
resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: {
    'azd-env-name': environmentName
  }
}

// Deploy all resources into the resource group
module resources 'resources.bicep' = {
  name: 'resources'
  scope: rg
  params: {
    environmentName: environmentName
    location: location
  }
}

output RESOURCE_GROUP_ID string = rg.id
output APP_SERVICE_URL string = resources.outputs.appServiceUrl
