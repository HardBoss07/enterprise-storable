# --- Configuration ---
$ProjectName = "Storable"

function Show-Help {
    Write-Host "`nUsage: .\run.ps1 [command]" -ForegroundColor Cyan
    Write-Host "`nCommands:"
    Write-Host "  up         Start all containers in detached mode"
    Write-Host "  down       Stop and remove containers"
    Write-Host "  build      Rebuild images and start"
    Write-Host "  logs       Tail logs for all services"
    Write-Host "  db         Open MySQL terminal (Requires root password)"
    Write-Host "  clean      Stop and REMOVE all volumes (Wipe DB)" -ForegroundColor Red
    Write-Host "  status     Show running containers"
    Write-Host "  restart    Quick restart of all containers"
    Write-Host "  format     Run Prettier and fix line endings (CRLF)" -ForegroundColor Green
}

# Check the argument passed to the script
switch ($args[0]) {
    "up" {
        Write-Host "Starting $ProjectName services..." -ForegroundColor Green
        docker-compose up -d
    }
    "down" {
        Write-Host "Stopping $ProjectName services..." -ForegroundColor Yellow
        docker-compose down
    }
    "build" {
        Write-Host "Rebuilding and starting $ProjectName..." -ForegroundColor Green
        docker-compose up -d --build
    }
    "logs" {
        docker-compose logs -f
    }
    "db" {
        Write-Host "Connecting to MySQL (mysql_db)..." -ForegroundColor Green
        docker exec -it mysql_db mysql -u root -p
    }
    "clean" {
        $confirmation = Read-Host "WARNING: This will delete ALL database data. Proceed? (y/n)"
        if ($confirmation -eq 'y') {
            docker-compose down -v
            Write-Host "Volumes cleaned and environment stopped." -ForegroundColor Green
        } else {
            Write-Host "Operation cancelled." -ForegroundColor Yellow
        }
    }
    "status" {
        docker-compose ps
    }
    "restart" {
        docker-compose restart
    }
    "format" {
        Write-Host "Running Prettier..." -ForegroundColor Green
        npx prettier . --write

        Write-Host "Converting line endings to CRLF..." -ForegroundColor Green
        
        $excludePaths = @("node_modules", ".next", ".git", "target", "bin", ".cache", "dist")

        $files = Get-ChildItem -Recurse -File | Where-Object { 
            $fullPath = $_.FullName
            $skip = $false
            foreach ($dir in $excludePaths) {
                if ($fullPath -like "*\$dir\*") { $skip = $true; break }
            }
            -not $skip
        }

        foreach ($file in $files) {
            try {
                $content = Get-Content -Raw -Path $file.FullName
                [System.IO.File]::WriteAllLines($file.FullName, $content)
            } catch {
                Write-Host "Could not process $($file.Name)" -ForegroundColor Gray
            }
        }
        Write-Host "Formatting and line-ending conversion complete!" -ForegroundColor Green
    }
    Default {
        Show-Help
    }
}