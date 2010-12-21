<?php
if (isset($_POST['json']) && $_POST['json']==1) $json=true;
else{
	$json=false;
	?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="he"  dir='rtl'>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>

<title>Link Web Development - contact form</title>
</head>
<body>
<?php
}
if (isset($_POST['e-mail']) && strlen($_POST['e-mail'])>0){
	if ($json):
	   echo '{"error":0}';
	else:
		?>
		<h1>יYou might be a robot.</h1>
		<h2> Please try again later</h2>
		<a href='/'>Go back</a>
        </body>
        </html>
		<?php
	endif;
	 
	die();
}

require_once '../includes/PHPMailer/class.phpmailer-lite.php';


$name = (isset($_POST['name']) && $_POST['name']!='') ? $_POST['name'] : 'אנונימי';
$email = (isset($_POST['email']) && $_POST['email']!='') ? $_POST['email'] :'אין';
$extra = (isset($_POST['more'])) ? $_POST['more'] : '';

    $Mail = new PHPMailerLite();
    $Mail->CharSet = 'utf-8';
    $Mail->Username = 'link@link-wd.co.il';
    $Mail->Password = 'rjntqvzz';
    $Mail->SMTPAuth=true;
    $Mail->Host = 'mail.link-wd.co.il';
    $Mail->Post = '2626';
    $Mail->Mailer = "smtp";
    $Mail->From = 'contact@link-wd.co.il';
    $Mail->Sender = 'contact@link-wd.co.il';
    $Mail->FromName = 'Arieh\'s Portfolio';
    $Mail->IsHTML(true);
    $Mail->Subject = 'New Message!';
    $Mail->Body="<html dir='rtl'>
<head>"
.'<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />'
."</head>
<body>
    <h1>התקבלה הודעה חדשה באתר!</h1>"
    ."<p>שם: $name</p>"
    ."<p>דוא\"ל: <a href='mailto:$email'>$email</a></p>"
    ."<p>הערות: $extra</p>"
    ."</body>
</html>";
    $Mail->AddAddress('arieh.glazer@gmail.com');
    //$Mail->AddAddress('link.wd@gmail.com');
    $Mail->Send();

if ($json) echo '{"success":true}';
else{
    ?>
	<strong>Your message has been submitted.</strong>
	<p>We shall return to you as soon as possible</p>
    <?php if (!isset($_SERVER['X-Requested-With']) || $_SERVER['X-Requested-With'] !=='XMLHttpRequest'):?>
        <p><a href="/">Go back</a></p>
    <?php endif; ?>
	</body>
	</html>
	<?php
}