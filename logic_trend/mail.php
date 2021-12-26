<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    //Load Composer's autoloader
    require '../vendor/autoload.php';

    class Mail {
        
        function config() {
            $mail = new PHPMailer(true);
            
            //Server settings
            $mail->SMTPDebug = SMTP::DEBUG_SERVER;
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'thinkwellit9@gmail.com';
            $mail->Password   = 'think123@';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port       = 465;

            return $mail;
        }

        function sendMail() {
            $mail = $this->config();
            // get-input
            $data = $_POST['data'];
            $data = json_decode($data);

            try {
                //Recipients
                $mail->setFrom('thinkwellit9@gmail.com', 'Administrator');
                $mail->addAddress('frostareport@gmail.com', 'Frosta User');
                
                //Content
                $mail->isHTML(true);
                $mail->addStringAttachment(file_get_contents('../assets/high-alert.png'), 'Alert.png');
                $mail->Subject = "Alert of Chart > 300";
                $mail->Body    = "<b>The data is higher than 300 at $data->time</b>";

                $mail->send();
                echo json_encode("Ok!");
            } catch (Exception $e) {
                echo json_encode("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
            }
        }
    }

    $mailer = new Mail();
    $mailer->sendMail();
?>