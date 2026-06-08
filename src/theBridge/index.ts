import bridgeSettingsAll from '../brdgeSettings/bridge.json';
import { getBridgeSettings} from './lib/common';
import { validateRequest} from './lib/validateData';
import {restSwitchingRouting} from './lib/REST/restRouting';



export async function theBridge(bridgeName:string, requestParams: any = null, requestBody: any = null) {  
const bridgeSettings = getBridgeSettings(bridgeName, bridgeSettingsAll); 
const connectionMethod = bridgeSettings?.connectionMethod;

//validate request structure before making the call /////////////////////////////////////////////////////////////////////////
{
  const validRequest:boolean = validateRequest(requestParams, bridgeSettings?.requestStructure);
  if(!validRequest)
  {
    console.log('Bridge Error: Invalid request structure. Expected fields are missing.');
    return;
  }
} 

//rest routing and call priority handling ////////////////////////////////////////////////////////////////////////////////////
let responseData:any;
if(connectionMethod === 'REST' )
{
    restSwitchingRouting(bridgeName, bridgeSettings, bridgeSettings?.connectionMethodType, requestParams, requestBody).then((response) => {
    responseData = response;
  });
}

  return responseData;
 
}
export default theBridge;
