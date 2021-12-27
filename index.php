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
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css" integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn" crossorigin="anonymous">
</head>
<body class="bg-dark">    
    <!-- header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand ml-5">
            <img src="assets/brand.jpeg" width="75" height="75" class="d-inline-block align-top" alt="">
        </a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">        
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="#">Make Frosta as Digital Leader</a>
                </li>

                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <select id="optionBar">
                            <option value="bar">Bar</option>
                            <option value="line">Line</option>
                        </select>
                    </a>
                </li>
            </ul>
        </div>
    </nav>

    <!-- loader -->
    <div class="wrapper" id="loader">
        <div class="loader"></div>
    </div>

    <!-- graph -->
    <div id="content">
        <div class="container mt-3 mb-8 shadow-lg p-3 rounded">
            <input type="text" class="input mt-3" id="dateRange"/>
            <button type="button" class="btn btn-sm btn-outline-danger" id="resetButton">Reset</button>
            
            <!-- acronim-legend-data -->
            <div class="">
                <span>MA1 mean: MiliAmpere 1</span>
                <span>MA2 mean: MiliAmpere 2</span>
            </div>

            <canvas id="chartAm-1"></canvas>
            <canvas id="chartAm-2"></canvas>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- date-picker -->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
    <script src="script_extends/graph.js"></script>
    <!-- bootstrap -->
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.min.js" integrity="sha384-VHvPCCyXqtD5DqJeNxl2dtTyhF78xXNXdkwX1CZeRusQfRKp+tA7hAShOK/B/fQ2" crossorigin="anonymous"></script>
</body>
</html>