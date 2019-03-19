<?php
/*************************************************************************************************

Use the CIM JSON API to retrieve a shipping address

SAMPLE REQUEST
--------------------------------------------------------------------------------------------------
{
   "getCustomerShippingAddressRequest":{
      "merchantAuthentication":{
         "name":"",
         "transactionKey":""
      },
      "customerProfileId":"31390172",
      "customerAddressId":"29366174"
   }
}

SAMPLE RESPONSE
--------------------------------------------------------------------------------------------------
{
   "address":{
      "customerAddressId":"29366174",
      "phoneNumber":"800-555-1234",
      "firstName":"John",
      "lastName":"Smith",
      "address":"123 Main Street",
      "city":"Townsville",
      "state":"NJ",
      "zip":"12345"
   },
   "messages":{
      "resultCode":"Ok",
      "message":[
         {
            "code":"I00001",
            "text":"Successful."
         }
      ]
   }
}

*************************************************************************************************/

    namespace JohnConde\Authnet;

    require('../../config.inc.php');
    require('../../src/autoload.php');

    $request  = AuthnetApiFactory::getJsonApiHandler(AUTHNET_LOGIN, AUTHNET_TRANSKEY, AuthnetApiFactory::USE_DEVELOPMENT_SERVER);
    $response = $request->getCustomerShippingAddressRequest(array(
        'customerProfileId' => '31390172',
        'customerAddressId' => '29366174'
    ));
?>

<!DOCTYPE html>
<html>
<html lang="en">
    <head>
        <title></title>
        <style type="text/css">
            table
            {
                border: 1px solid #cccccc;
                margin: auto;
                border-collapse: collapse;
                max-width: 90%;
            }

            table td
            {
                padding: 3px 5px;
                vertical-align: top;
                border-top: 1px solid #cccccc;
            }

            pre
            {
            	overflow-x: auto; /* Use horizontal scroller if needed; for Firefox 2, not needed in Firefox 3 */
            	white-space: pre-wrap; /* css-3 */
            	white-space: -moz-pre-wrap !important; /* Mozilla, since 1999 */
            	white-space: -pre-wrap; /* Opera 4-6 */
            	white-space: -o-pre-wrap; /* Opera 7 */ /*
            	width: 99%; */
            	word-wrap: break-word; /* Internet Explorer 5.5+ */
            }

            table th
            {
                background: #e5e5e5;
                color: #666666;
            }

            h1, h2
            {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <h1>
            CIM :: Get Shipping Address
        </h1>
        <h2>
            Results
        </h2>
        <table>
            <tr>
                <th>Response</th>
                <td><?php echo $response->messages->resultCode; ?></td>
            </tr>
            <tr>
                <th>code</th>
                <td><?php echo $response->messages->message[0]->code; ?></td>
            </tr>
            <tr>
                <th>Successful?</th>
                <td><?php echo ($response->isSuccessful()) ? 'yes' : 'no'; ?></td>
            </tr>
            <tr>
                <th>Error?</th>
                <td><?php echo ($response->isError()) ? 'yes' : 'no'; ?></td>
            </tr>
            <tr>
                <th>firstName</th>
                <td><?php echo $response->address->firstName; ?></td>
            </tr>
            <tr>
                <th>lastName</th>
                <td><?php echo $response->address->lastName; ?></td>
            </tr>
            <tr>
                <th>address</th>
                <td><?php echo $response->address->address; ?></td>
            </tr>
            <tr>
                <th>city</th>
                <td><?php echo $response->address->city; ?></td>
            </tr>
            <tr>
                <th>state</th>
                <td><?php echo $response->address->state; ?></td>
            </tr>
            <tr>
                <th>zip</th>
                <td><?php echo $response->address->zip; ?></td>
            </tr>
            <tr>
                <th>phoneNumber</th>
                <td><?php echo $response->address->phoneNumber; ?></td>
            </tr>
            <tr>
                <th>customerAddressId</th>
                <td><?php echo $response->address->customerAddressId; ?></td>
            </tr>
        </table>
        <h2>
            Raw Input/Output
        </h2>
<?php
    echo $request, $response;
?>
    </body>
</html>
