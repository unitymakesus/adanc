<?php

/**
 * This file is part of the AuthnetJSON package.
 *
 * (c) John Conde <stymiee@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace JohnConde\Authnet;

/**
 * Creates a request to the Authorize.Net Webhooks endpoints
 *
 * @package     AuthnetJSON
 * @author      John Conde <stymiee@gmail.com>
 * @copyright   John Conde <stymiee@gmail.com>
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache License, Version 2.0
 * @link        https://github.com/stymiee/authnetjson
 * @see         https://developer.authorize.net/api/reference/features/webhooks.html
 */
class AuthnetWebhooksRequest {

	/**
	 * @var     string  Base URL for processing a webhook
	 */
	private $url;

	/**
	 * @var     string  Endpoint for processing a webhook
	 */
	private $endpoint;

	/**
	 * @var     string  JSON formatted API request
	 */
	private $requestJson;

	/**
	 * @var     object  Wrapper object representing an endpoint
	 */
	private $processor;

	/**
	 * Creates the request object by setting the Authorize.Net credentials and URL of the endpoint to be used
	 * for the API call
	 *
	 * @param   string $api_url URL endpoint for processing a transaction
	 */
	public function __construct( $api_url ) {
		$this->url = $api_url;
	}

	/**
	 * Outputs the account credentials, endpoint URL, and request JSON in a human readable format
	 *
	 * @return  string  HTML table containing debugging information
	 */
	public function __toString() {
		$output = '';
		$output .= '<table summary="Authorize.Net Request" id="authnet-request">' . "\n";
		$output .= '<tr>' . "\n\t\t" . '<th colspan="2"><b>Class Parameters</b></th>' . "\n" . '</tr>' . "\n";
		$output .= '<tr>' . "\n\t\t" . '<td><b>Authnet Server URL</b></td><td>' . $this->url . '</td>' . "\n" . '</tr>' . "\n";
		$output .= '<tr>' . "\n\t\t" . '<th colspan="2"><b>Request JSON</b></th>' . "\n" . '</tr>' . "\n";
		if ( ! empty( $this->requestJson ) ) {
			$output .= '<tr><td colspan="2"><pre>' . "\n";
			$output .= $this->requestJson . "\n";
			$output .= '</pre></td></tr>' . "\n";
		}
		$output .= '</table>';

		return $output;
	}

	/**
	 * Outputs the endpoint URL and request JSON in a human readable format
	 *
	 * @return  array   list of event types
	 */
	public function getEventTypes() {
		$this->endpoint = 'eventtypes';
		$this->url      = sprintf( '%s%s', $this->url, $this->endpoint );
		$response       = $this->get( $this->url );

		return new AuthnetWebhooksResponse( $response );
	}

	/**
	 * Outputs the endpoint URL and request JSON in a human readable format
	 *
	 * @param   array  $webhooks   Array of webhooks to be created or modified
	 * @param   string $webhookUrl URL of where webhook notifications will be sent
	 * @param   string $status     Status of webhooks to be created or modified [active/inactive]
	 *
	 * @throws  \JohnConde\Authnet\AuthnetInvalidParameterException
	 *
	 * @return  array   list of event types
	 */
	public function createWebhooks( Array $webhooks, $webhookUrl, $status = 'active' ) {
		$this->endpoint    = 'webhooks';
		$this->url         = sprintf( '%s%s', $this->url, $this->endpoint );
		$request           = array(
			'url'        => $webhookUrl,
			'eventTypes' => $webhooks,
			'status'     => $status,
		);
		$this->requestJson = json_encode( $request );
		$response          = $this->post( $this->url, $this->requestJson );

		return new AuthnetWebhooksResponse( $response );
	}

	/**
	 * Sends a test ping to a URL for (a) designated webhook(s)
	 *
	 * @param   string $webhookId Webhook ID to be tested
	 *
	 * @throws  \JohnConde\Authnet\AuthnetInvalidParameterException
	 */
	public function testWebhook( $webhookId ) {
		$this->endpoint    = 'webhooks';
		$this->url         = sprintf( '%s%s/%s/pings', $this->url, $this->endpoint, $webhookId );
		$this->requestJson = json_encode( array() );
		$this->post( $this->url, $this->requestJson );
	}

	/**
	 * List all of your webhooks
	 *
	 * @return  array   list of event types
	 */
	public function getWebhooks() {
		$this->endpoint = 'webhooks';
		$this->url      = sprintf( '%s%s', $this->url, $this->endpoint );
		$response       = $this->get( $this->url );

		return new AuthnetWebhooksResponse( $response );
	}

	/**
	 * Get a webhook
	 *
	 * @param   string $webhookId Webhook ID to be retrieved
	 *
	 * @return  array   list of event types
	 */
	public function getWebhook( $webhookId ) {
		$this->endpoint = 'webhooks';
		$this->url      = sprintf( '%s%s/%s', $this->url, $this->endpoint, $webhookId );
		$response       = $this->get( $this->url );

		return new AuthnetWebhooksResponse( $response );
	}

	/**
	 * Outputs the endpoint URL and request JSON in a human readable format
	 *
	 * @param   array  $webhookId  Webhook ID to be modified
	 * @param   string $webhookUrl URL of where webhook notifications will be sent
	 * @param   array  $eventTypes Array of event types to be added/removed
	 * @param   string $status     Status of webhooks to be modified [active/inactive]
	 *
	 * @throws  \JohnConde\Authnet\AuthnetInvalidParameterException
	 *
	 * @return  array   list of event types
	 */
	public function updateWebhook( $webhookId, $webhookUrl, Array $eventTypes, $status = 'active' ) {
		$this->endpoint    = 'webhooks';
		$this->url         = sprintf( '%s%s/%s', $this->url, $this->endpoint, $webhookId );
		$request           = array(
			'url'        => $webhookUrl,
			'eventTypes' => $eventTypes,
			'status'     => $status,
		);
		$this->requestJson = json_encode( $request );
		$response          = $this->put( $this->url, $this->requestJson );

		return new AuthnetWebhooksResponse( $response );
	}

	/**
	 * Delete a webhook
	 *
	 * @param   string $webhookId Webhook ID to be retrieved
	 *
	 * @return  array   list of event types
	 */
	public function deleteWebhook( $webhookId ) {
		$this->endpoint = 'webhooks';
		$this->url      = sprintf( '%s%s/%s', $this->url, $this->endpoint, $webhookId );
		$this->delete( $this->url );
	}

	/**
	 * Retrieve Notification History
	 *
	 * @param   integer $limit  Default: 1000
	 * @param   integer $offset Default: 0
	 *
	 * @return  array   list of event types
	 */
	public function getNotificationHistory( $limit = 1000, $offset = 0 ) {
		$this->endpoint = 'notifications';
		$this->url      = sprintf( '%s%s', $this->url, $this->endpoint );
		$response       = $this->get( $this->url, array(
			'offset' => $offset,
			'limit'  => $limit,
		) );

		return new AuthnetWebhooksResponse( $response );
	}

	/**
	 * Tells the handler to make the API call to Authorize.Net
	 *
	 * @throws  \JohnConde\Authnet\AuthnetCurlException
	 */
	private function handleResponse() {
		if ( ! $this->processor->error ) {
			return $this->processor->response;
		}
		$error_message = null;
		$error_code    = null;
		if ( $this->processor->error_code ) {
			$error_message = $this->processor->error_message;
			$error_code    = $this->processor->error_code;
			if ( empty( $error_message ) ) {
				$response      = json_decode( $this->processor->response );
				$error_message = sprintf( '(%u) %s: %s', $response->status, $response->reason, $response->message );
			}
		}
		throw new AuthnetCurlException( 'Connection error: ' . $error_message . ' (' . $error_code . ')' );
	}

	/**
	 * Make GET request via Curl
	 *
	 * @param   object $url
	 *
	 * @throws  \JohnConde\Authnet\AuthnetCurlException
	 */
	private function get( $url ) {
		$this->processor->get( $url );

		return $this->handleResponse();
	}

	/**
	 * Make POST request via Curl
	 *
	 * @param   object $url     API endpoint
	 * @param   object $request JSON request payload
	 *
	 * @throws  \JohnConde\Authnet\AuthnetCurlException
	 */
	private function post( $url, $request ) {
		$this->processor->post( $url, $request );

		return $this->handleResponse();
	}

	/**
	 * Make PUT request via Curl
	 *
	 * @param   object $url     API endpoint
	 * @param   object $request JSON request payload
	 *
	 * @throws  \JohnConde\Authnet\AuthnetCurlException
	 */
	private function put( $url, $request ) {
		$this->processor->put( $url, $request, true );

		return $this->handleResponse();
	}

	/**
	 * Make DELETE request via Curl
	 *
	 * @param   object $url     API endpoint
	 * @param   object $request JSON request payload
	 *
	 * @throws  \JohnConde\Authnet\AuthnetCurlException
	 */
	private function delete( $url ) {
		$this->processor->delete( $url, array(), true );

		return $this->handleResponse();
	}

	/**
	 * Sets the handler to be used to handle our API call. Mainly used for unit testing as Curl is used by default.
	 *
	 * @param   object $processor
	 */
	public function setProcessHandler( $processor ) {
		$this->processor = $processor;
	}

	/**
	 * Gets the request sent to Authorize.Net in JSON format for logging purposes
	 *
	 * @return  string transaction request sent to Authorize.Net in JSON format
	 */
	public function getRawRequest() {
		return $this->requestJson;
	}
}