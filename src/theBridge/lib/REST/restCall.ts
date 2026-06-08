import { bridgeTraceAndTrack } from '../traceAndTrack';
// bridgeRestCall - GET //////////////////////////////////////////////////////////////////////////////////////////
export async function bridgeRestCallGet(bridgeName: string, bridgeSettings: any, requestParams: any)
{
  // for Get Type
  if(bridgeSettings?.connectionMethodType === 'GET')
  {
    // Construct the URL with query parameters
    const url = new URL(bridgeSettings?.apiEndpoint);
    
    // Build query string from requestParams if not null
    if (requestParams && typeof requestParams === 'object') {
    
      Object.keys(requestParams).forEach(key => {
  if (bridgeSettings?.requestStructure?.includes(key)) {
    url.searchParams.append(key, requestParams[key]);
  }
});

    }
    
    const requestOptions = {
      method: 'GET',
      headers: bridgeSettings?.headers || {},
    };
    // Make the API call    
    try {
      const startTime = Math.round(performance.now()) ;
      const response = await fetch(url.toString(), requestOptions);
      
      // Log all response headers
      const headersObj: any = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      //console.log('Response Headers:', headersObj);
      const endTime = Math.round(performance.now());
      //console.log(`API Status: HTTP Status Code ${response.status} - ${response.statusText}`);
      await bridgeTraceAndTrack(bridgeName, 'Success', response.status, endTime - startTime, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
      // Check HTTP status code
      if (!response.ok) {
        console.error(`API Error: HTTP Status Code ${response.status} - ${response.statusText}`);
        return false;
      }
      const responseType = bridgeSettings?.responseType?.toLowerCase();
      let data: any;

      switch (responseType) {
        case 'application/json':
          data = await response.json();
          break;
        case 'application/xml':
        case 'text/html':
        case 'text/plain':
          data = await response.text();
          break;
        case 'application/octet-stream':
          data = await response.arrayBuffer();
          break;
        default:
          const contentType = response.headers.get('content-type')?.toLowerCase();
          if (contentType?.includes('application/json')) {
            data = await response.json();
          } else if (contentType?.includes('text/') || contentType?.includes('xml') || contentType?.includes('html')) {
            data = await response.text();
          } else {
            data = await response.arrayBuffer();
          }
          break;
      }

      return data;
    } catch (error: any) {
      
      console.error('Bridge API Network Error:', {
        message: error?.message,
        errorCode: error?.code,
        name: error?.name,
        fullError: error
      });
      await bridgeTraceAndTrack(bridgeName, 'Error', 0,0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
      return false;
    }
  }

}

// bridgeRestCall - POST //////////////////////////////////////////////////////////////////////////////////////////
export async function bridgeRestCallPost(bridgeName: string, bridgeSettings: any, requestParams: any, requestBody: any)
{
  // for POST Type
  if(bridgeSettings?.connectionMethodType === 'POST')
  {
    const url = new URL(bridgeSettings?.apiEndpoint);
     Object.keys(requestParams).forEach(key => {
  if (bridgeSettings?.requestStructure?.includes(key)) {
    url.searchParams.append(key, requestParams[key]);
  }
});
const validRequestBody:any = requestBody ? Object.keys(requestBody).reduce((acc: any, key) => {
  if (bridgeSettings?.requestBody?.includes(key)) {
    acc[key] = requestBody[key];
  }
  return acc;
}, {})
: null;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...bridgeSettings?.headers || {},
      },
      body: JSON.stringify(validRequestBody),
    };
    // Make the API call
    try {
      const startTime = Math.round(performance.now());
      const response = await fetch(url.toString(), requestOptions);

      // collect headers
      const headersObj: any = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });

      const endTime = Math.round(performance.now());
      await bridgeTraceAndTrack(bridgeName, 'Success', response.status, endTime - startTime, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );

      if (!response.ok) {
        console.error(`API Error: HTTP Status Code ${response.status} - ${response.statusText}`);
        return false;
      }

      const responseType = bridgeSettings?.responseType?.toLowerCase();
      let data: any;

      switch (responseType) {
        case 'application/json':
          data = await response.json();
          break;
        case 'application/xml':
        case 'text/html':
        case 'text/plain':
          data = await response.text();
          break;
        case 'application/octet-stream':
          data = await response.arrayBuffer();
          break;
        default:
          const contentType = response.headers.get('content-type')?.toLowerCase();
          if (contentType?.includes('application/json')) {
            data = await response.json();
          } else if (contentType?.includes('text/') || contentType?.includes('xml') || contentType?.includes('html')) {
            data = await response.text();
          } else {
            data = await response.arrayBuffer();
          }
          break;
      }

      return data;
    } catch (error: any) {
      console.error('Bridge API Network Error:', {
        message: error?.message,
        errorCode: error?.code,
        name: error?.name,
        fullError: error
      });
      await bridgeTraceAndTrack(bridgeName, 'Error', 0, 0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
      return false;
    }
    }

}

// bridgeRestCall - PUT //////////////////////////////////////////////////////////////////////////////////////////
// bridgeRestCall - DELETE //////////////////////////////////////////////////////////////////////////////////////////
export async function bridgeRestCallDelete(bridgeName: string, bridgeSettings: any, requestParams: any, requestBody: any)
{
  // for DELETE Type
  if(bridgeSettings?.connectionMethodType === 'DELETE')
  {
     const url = new URL(bridgeSettings?.apiEndpoint);
     Object.keys(requestParams).forEach(key => {
  if (bridgeSettings?.requestStructure?.includes(key)) {
    url.searchParams.append(key, requestParams[key]);
  }
});
    const validRequestBody:any = requestBody ? Object.keys(requestBody).reduce((acc: any, key) => {
  if (bridgeSettings?.requestBody?.includes(key)) {
    acc[key] = requestBody[key];
  }
  return acc;
}, {})
: null;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...bridgeSettings?.headers || {},
      },
      body: JSON.stringify(validRequestBody),
    };
    // Make the API call
    try {
      const startTime = Math.round(performance.now());
      const response = await fetch(url.toString(), requestOptions);

      // collect headers
      const headersObj: any = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });

      const endTime = Math.round(performance.now());
      await bridgeTraceAndTrack(bridgeName, 'Success', response.status, endTime - startTime, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );

      if (!response.ok) {
        console.error(`API Error: HTTP Status Code ${response.status} - ${response.statusText}`);
         await bridgeTraceAndTrack(bridgeName, 'Error', 0, 0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
        return false;
      }

      const responseType = bridgeSettings?.responseType?.toLowerCase();
      let data: any;

      switch (responseType) {
        case 'application/json':
          data = await response.json();
          break;
        case 'application/xml':
        case 'text/html':
        case 'text/plain':
          data = await response.text();
          break;
        case 'application/octet-stream':
          data = await response.arrayBuffer();
          break;
        default:
          const contentType = response.headers.get('content-type')?.toLowerCase();
          if (contentType?.includes('application/json')) {
            data = await response.json();
          } else if (contentType?.includes('text/') || contentType?.includes('xml') || contentType?.includes('html')) {
            data = await response.text();
          } else {
            data = await response.arrayBuffer();
          }
          break;
      }

      return data;
    } catch (error: any) {
      console.error('Bridge API Network Error:', {
        message: error?.message,
        errorCode: error?.code,
        name: error?.name,
        fullError: error
      });
      await bridgeTraceAndTrack(bridgeName, 'Error', 0, 0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
      return false;
    }
    }

}
// bridgeRestCall - PUT //////////////////////////////////////////////////////////////////////////////////////////
export async function bridgeRestCallPut(bridgeName: string, bridgeSettings: any, requestParams: any, requestBody: any)
{
  // for PUT Type
  if(bridgeSettings?.connectionMethodType === 'PUT')
  {
     const url = new URL(bridgeSettings?.apiEndpoint);
     Object.keys(requestParams).forEach(key => {
  if (bridgeSettings?.requestStructure?.includes(key)) {
    url.searchParams.append(key, requestParams[key]);
  }
});
    const validRequestBody:any = requestBody ? Object.keys(requestBody).reduce((acc: any, key) => {
  if (bridgeSettings?.requestBody?.includes(key)) {
    acc[key] = requestBody[key];
  }
  return acc;
}, {})
: null;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...bridgeSettings?.headers || {},
      },
      body: JSON.stringify(validRequestBody),
    };
    // Make the API call
    try {
      const startTime = Math.round(performance.now());
      const response = await fetch(url.toString(), requestOptions);

      // collect headers
      const headersObj: any = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });

      const endTime = Math.round(performance.now());
      await bridgeTraceAndTrack(bridgeName, 'Success', response.status, endTime - startTime, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );

      if (!response.ok) {
        console.error(`API Error: HTTP Status Code ${response.status} - ${response.statusText}`);
         await bridgeTraceAndTrack(bridgeName, 'Error', 0, 0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
        return false;
      }

      const responseType = bridgeSettings?.responseType?.toLowerCase();
      let data: any;

      switch (responseType) {
        case 'application/json':
          data = await response.json();
          break;
        case 'application/xml':
        case 'text/html':
        case 'text/plain':
          data = await response.text();
          break;
        case 'application/octet-stream':
          data = await response.arrayBuffer();
          break;
        default:
          const contentType = response.headers.get('content-type')?.toLowerCase();
          if (contentType?.includes('application/json')) {
            data = await response.json();
          } else if (contentType?.includes('text/') || contentType?.includes('xml') || contentType?.includes('html')) {
            data = await response.text();
          } else {
            data = await response.arrayBuffer();
          }
          break;
      }

      return data;
    } catch (error: any) {
      console.error('Bridge API Network Error:', {
        message: error?.message,
        errorCode: error?.code,
        name: error?.name,
        fullError: error
      });
      await bridgeTraceAndTrack(bridgeName, 'Error', 0, 0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
      return false;
    }
    }

}
// bridgeRestCall - PATCH //////////////////////////////////////////////////////////////////////////////////////////
export async function bridgeRestCallPatch(bridgeName: string, bridgeSettings: any, requestParams: any, requestBody: any)
{
  // for PATCH Type
  if(bridgeSettings?.connectionMethodType === 'PATCH')
  {
     const url = new URL(bridgeSettings?.apiEndpoint);
     Object.keys(requestParams).forEach(key => {
  if (bridgeSettings?.requestStructure?.includes(key)) {
    url.searchParams.append(key, requestParams[key]);
  }
});
    const validRequestBody:any = requestBody ? Object.keys(requestBody).reduce((acc: any, key) => {
  if (bridgeSettings?.requestBody?.includes(key)) {
    acc[key] = requestBody[key];
  }
  return acc;
}, {})
: null;
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...bridgeSettings?.headers || {},
      },
      body: JSON.stringify(validRequestBody),
    };
    // Make the API call
    try {
      const startTime = Math.round(performance.now());
      const response = await fetch(url.toString(), requestOptions);

      // collect headers
      const headersObj: any = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });

      const endTime = Math.round(performance.now());
      await bridgeTraceAndTrack(bridgeName, 'Success', response.status, endTime - startTime, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );

      if (!response.ok) {
        console.error(`API Error: HTTP Status Code ${response.status} - ${response.statusText}`);
         await bridgeTraceAndTrack(bridgeName, 'Error', 0, 0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
        return false;
      }

      const responseType = bridgeSettings?.responseType?.toLowerCase();
      let data: any;

      switch (responseType) {
        case 'application/json':
          data = await response.json();
          break;
        case 'application/xml':
        case 'text/html':
        case 'text/plain':
          data = await response.text();
          break;
        case 'application/octet-stream':
          data = await response.arrayBuffer();
          break;
        default:
          const contentType = response.headers.get('content-type')?.toLowerCase();
          if (contentType?.includes('application/json')) {
            data = await response.json();
          } else if (contentType?.includes('text/') || contentType?.includes('xml') || contentType?.includes('html')) {
            data = await response.text();
          } else {
            data = await response.arrayBuffer();
          }
          break;
      }

      return data;
    } catch (error: any) {
      console.error('Bridge API Network Error:', {
        message: error?.message,
        errorCode: error?.code,
        name: error?.name,
        fullError: error
      });
      await bridgeTraceAndTrack(bridgeName, 'Error', 0, 0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
      return false;
    }
    }

}

