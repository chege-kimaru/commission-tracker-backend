param (
    [Parameter(Mandatory)][string]$a
)

$Env:DB_NAME = 'commission_tracker'
$Env:DB_USER = 'postgres'
$Env:DB_PASSWORD = 'kevinkimaru'
$Env:DB_HOST = 'localhost'
$Env:DB_PORT = '5432'
$Env:DB_DIALECT = 'postgres'

if($a -eq 'migrate') {
    & sequelize db:migrate
} elseif ($a -eq 'rollback') {
    & sequelize db:migrate:undo
} elseif ($a -eq 'seed') {
    & sequelize db:seed:all
} else {
    Write-Host "Invalid argument"
}