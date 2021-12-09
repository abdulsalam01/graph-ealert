<?php
    require '../vendor/autoload.php';
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    // added random comment here
    class API {

        function GetData() {
            $limit = $_GET['limit'];

            $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
            $spreadsheet = $reader->load("../data_source/source.xlsx");
            $sheetData = $spreadsheet->getActiveSheet()->toArray();

            $reader->setReadDataOnly(true);
            
            $i=1;
            unset($sheetData[0]);

            $response = [];
            for($i = 1; $i <= $limit; $i++) {
                $value = $sheetData[$i];

                $date = $value[0];
                $time = $value[1];
                $mA1 = $value[7];
                $status = $value[8];
                $mA2 = $value[17]; 

                $response[$i - 1] = [
                    'datetime' => "$date $time",
                    'dataset_1' => $mA1,
                    'dataset_2' => $mA2,
                    'status' => $status
                ];
            }

            header('Content-Type: application/json; charset=utf-8');
            return $response;
        }
    }

    $data = new API();
    $response = $data->GetData();
    echo json_encode($response);
?>