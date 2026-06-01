import bridgeSettingsAll from '../brdgeSettings/bridge.json';
import { getBridgeSettings } from './lib/common';
import { validateRequest, validateResponse } from './lib/validateData';
import {restGetRouting, restPostRouting } from './lib/REST/restRouting';
import { bridgeTraceAndTrack } from './lib/traceAndTrack';


export async function theBridge(bridgeName:string, requestParams: any = null, requestBody: any = null) {  
const bridgeSettings = getBridgeSettings(bridgeName, bridgeSettingsAll); 
const connectionMethod = bridgeSettings?.connectionMethod;

//---- 6. validate request structure
if(bridgeSettings?.requestStructure && bridgeSettings?.requestStructure.length > 0)
{
  const validRequest:boolean = validateRequest(requestParams, bridgeSettings?.requestStructure);
  if(!validRequest)
  {
    console.log('Bridge Error: Invalid request structure. Expected fields are missing.');
    return;
  }
} 


//---- 7  callApi
// restGet() ////////////////////////////////////////////////////////////////////////////////////////////////


let responseData:any;
if(connectionMethod === 'REST' )
{
  if(bridgeSettings?.connectionMethodType === 'GET') {        
    responseData = await restGetRouting(bridgeName, bridgeSettings, requestParams);
  }
  else if(bridgeSettings?.connectionMethodType === 'POST') {
    responseData = await restPostRouting(bridgeName, bridgeSettings, requestParams, requestBody);
  }
  else if(bridgeSettings?.connectionMethodType === 'PUT') {
    //responseData = await bridgeRestCallPut(bridgeSettings, requestParams);
  }
  else if(bridgeSettings?.connectionMethodType === 'PATCH') {
   // responseData = await bridgeRestCallPatch(bridgeSettings, requestParams);
  }
  else if(bridgeSettings?.connectionMethodType === 'DELETE') {
   // responseData = await bridgeRestCallDelete(bridgeSettings, requestParams);
  }
}
// ---- 8. validate response structure
let validResponse:boolean = true;

if((bridgeSettings?.connectionMethodType === 'GET' || bridgeSettings?.connectionMethodType === 'POST') && bridgeSettings?.responseType?.toLowerCase() === 'application/json')
{
  validResponse = validateResponse(responseData, bridgeSettings?.responseStructure);
  if(!validResponse)
  {
    console.log('Bridge Error: Invalid response structure. Expected fields are missing.');
    await bridgeTraceAndTrack(bridgeName, 'validateResponseError', 0,0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
    return;
  }
  else
  {
    return responseData;
  }
}
else
{
  // For PUT, PATCH, DELETE - just check if responseData exists
  if(!responseData)
  {
    console.log('Bridge Error: No response data received.');
    await bridgeTraceAndTrack(bridgeName, 'Error', 0,0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
    return;
  }
}



}




export default theBridge;
