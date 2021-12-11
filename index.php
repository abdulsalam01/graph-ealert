<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chart</title>

    <!-- datepicker -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
    <!-- own-css -->
    <link rel="stylesheet" href="script_extends/style.css"/>
</head>
<body>
    <!-- loader -->
    <div class="wrapper" id="loader">
        <div class="loader"></div>
    </div>

    <!-- graph -->
    <div id="content" class="d-none">
        <div class="container form">
            <input type="text" id="dateRange"/>
        </div>

        <canvas id="chartAm"></canvas>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- date-picker -->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
    <script src="script_extends/graph.js"></script>
</body>
</html>