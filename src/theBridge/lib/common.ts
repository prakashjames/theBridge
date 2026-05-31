//getBridgeSettings////////////////////////////////////////////////////////////////////////////////////////
export function getBridgeSettings(bridgeClientName: string, bridgeSettings: any)
{
  const bridgeObject:any = JSON.parse(JSON.stringify(bridgeSettings));  
  // Find and return the matching bridge client object
  const matchingBridge = bridgeObject.theBridgeClient.find((bridge: any) => bridge[bridgeClientName]);
  return matchingBridge ? matchingBridge[bridgeClientName] : null;
}
