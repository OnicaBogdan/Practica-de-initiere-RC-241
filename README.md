<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Practica de initiere RC-241</title>
    <style>
        body {
            margin: 0;
            font-family: sans-serif;
            background-color: #f4f4f4;
        }

        .navbar {
            background-color: blue;
            padding: 15px 20px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .navbar-title {
            color: white;
            font-size: 24px;
            font-weight: bold;
            display: inline-block;
        }

        .container {
            padding: 20px;
        }

        .name-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding: 0 20px;
        }

        .important-center {
            text-align: center;
            margin: 0 20px;
        }

        .input-section {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            margin: 10px;
            min-width: 200px;
        }

        .input-group label {
            margin-bottom: 5px;
            font-weight: bold;
        }

        .input-group input[type="text"],
        .input-group select,
        .input-group input[type="date"] {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1rem;
        }

        .images-section {
            display: flex;
            justify-content: space-between; /* Space between the images */
            align-items: center;
            margin-top: 20px;
        }

        .images-section img {
            height: auto;
            margin: 10px;
            box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
        }

        .images-section img.dog {
            width: 300px; /* Dog image size */
        }

        .images-section img.cat,
        .images-section img.tiger {
            width: 450px; /* Cat and Tiger images resized to 450px */
        }

        .interactive-elements {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            margin-top: 20px;
        }

        .circle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #ccc;
            cursor: pointer;
            transition: background-color 0.3s ease;
            display: inline-block;
            vertical-align: middle;
        }

        .circle.green {
            background-color: green;
        }

        .circle-label {
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
        }

        .square {
            width: 20px; /* Adjusted to match the checkmark size */
            height: 20px;
            border: 2px solid #333;
            background-color: #fff;
            cursor: pointer;
            display: inline-block;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            color: green;
            vertical-align: middle;
        }

        .square.checked::before {
            content: '\2713';
        }

        .square-label {
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
        }

        .footer {
            background-color: blue;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
            font-size: 18px;
            font-weight: bold;
        }

        body {
            padding-bottom: 60px;
        }

        @media (max-width: 768px) {
            .name-section,
            .input-section,
            .images-section {
                flex-direction: column;
                align-items: center;
            }

            .name-left,
            .name-right,
            .important-center {
                margin: 10px 0;
            }

            .images-section img {
                max-width: 80%;
            }

            .input-group {
                width: 80%;
                min-width: auto;
            }

            .interactive-elements {
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <header class="navbar">
        <div class="navbar-title">Practica de initiere RC-241</div>
    </header>

    <main class="container">
        <section class="name-section">
            <div class="name-left">Onica Bogdan</div>
            <div class="important-center">
                <div>Mediu</div>
                <div>Important</div>
            </div>
            <div class="name-right">Onica Bogdan</div>
        </section>

        <section class="input-section">
            <div class="input-group">
                <label for="text-input">Text:</label>
                <input type="text" id="text-input" placeholder="Scrie aici...">
            </div>
            <div class="input-group">
                <label for="options-select">Optiuni:</label>
                <select id="options-select">
                    <option value="">Alegeti o optiune</option>
                    <option value="opt1">Optiunea 1</option>
                    <option value="opt2">Optiunea 2</option>
                    <option value="opt3">Optiunea 3</option>
                </select>
            </div>
            <div class="input-group">
                <label for="date-select">Data:</label>
                <input type="date" id="date-select">
            </div>
        </section>

        <section class="images-section">
            <!-- Dog image -->
            <img class="dog" src="https://images.pexels.com/photos/4587993/pexels-photo-4587993.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Dog Image">

            <!-- Cat image -->
            <img class="cat" src="https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Cat Image">

            <!-- Tiger image -->
            <img class="tiger" src="https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Tiger Image">
        </section>

        <section class="interactive-elements">
            <div>
                <div class="circle" id="color-circle"></div>
                <span class="circle-label">Varianta Corecta</span>
            </div>
            <div>
                <div class="square" id="check-square"></div>
                <span class="square-label">Raspuns Corect.</span>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="footer-left">Onica Bogdan</div>
        <div class="footer-right">Onica Bogdan</div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const colorCircle = document.getElementById('color-circle');
            if (colorCircle) {
                colorCircle.addEventListener('click', () => {
                    colorCircle.classList.toggle('green');
                });
            }

            const checkSquare = document.getElementById('check-square');
            if (checkSquare) {
                checkSquare.addEventListener('click', () => {
                    checkSquare.classList.toggle('checked');
                });
            }
        });
    </script>
</body>
</html>
