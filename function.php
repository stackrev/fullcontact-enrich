<?php
/**
 * Theme functions and definitions
 *
 * @package HelloElementorChild
 */
/**
 * Load child theme css and optional scripts
 *
 * @return void
 */
function hello_elementor_child_enqueue_scripts()
{
  wp_enqueue_style(
    'hello-elementor-child-style',
    get_stylesheet_directory_uri() . '/style.css',
    [
      'hello-elementor-theme-style',
    ],
    '1.0.0'
  );
}
add_action('wp_enqueue_scripts', 'hello_elementor_child_enqueue_scripts');

function send_traffic($type)
{

	$ip_address = $_SERVER['REMOTE_ADDR'];
  $current_time = date('Y-m-d H:i:s');
  if ($type == 'pid')
    $key = $_COOKIE['fc_pid'];
  else if ($type == 'maid')
    $key = $_SERVER['REQUEST_URI'];

  $curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => '147.182.133.115:3000/api/log',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'{
    "type": "' . $type . '",
    "key": "' . $key . '",
    "date": "' . $current_time . '",
    "ip": "' . $ip_address . '"
  }',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);
echo "<script>console.log('The value of \$response is: " . $response . "');</script>";

curl_close($curl);
}
function execute_once_on_visit()
{
  if ($_COOKIE['fc_pid'])
  	send_traffic('pid');
}
add_action('init', 'execute_once_on_visit');


function detect_url_change()
{
  // Get the current URL
  $current_url = $_SERVER['REQUEST_URI'];

  if (strstr($current_url, "maid"))
    send_traffic('maid');
}

add_action('template_redirect', 'detect_url_change');