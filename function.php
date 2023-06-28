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

function send_traffic()
{
  if (!$_COOKIE['fc_pid'])
    return;
  $pid = $_COOKIE['fc_pid'];
  $current_time = date('Y-m-d H:i:s');
  $ip_address = $_SERVER['REMOTE_ADDR'];

  $curl = curl_init();

  curl_setopt_array(
    $curl,
    array(
      CURLOPT_URL => '147.182.133.115:3000/api/log',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => '{
    "pid": "' . $pid . '",
    "date": "' . $current_time . '",
    "ip": "' . $ip_address . '"
  }',
      CURLOPT_HTTPHEADER => array(
        'Content-Type: application/json',
        'Authorization: Bearer lnz8g5J26bwq8AW60MzpfUYa6LUo5xntd'
      ),
    )
  );

  $response = curl_exec($curl);

  curl_close($curl);
}
function execute_once_on_visit()
{
  send_traffic();
}
add_action('init', 'execute_once_on_visit');