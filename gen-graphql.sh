#!/bin/bash

# Ищем директорию, содержащую .graphql файлы в папке src, исключая node_modules
graphql_dir=$(find src/ -type f -name "*.graphql" ! -path "*/node_modules/*" -exec dirname {} \; | head -n 1)

# Проверяем, что директория найдена
if [ -n "$graphql_dir" ]; then
    echo "Найдена директория с графQL схемами: $graphql_dir"

    # Копируем файл codegen.yaml в найденную директорию
    cp codegen.yaml "$graphql_dir"

    # Переходим в директорию с графQL схемами
    if cd "$graphql_dir"; then
        # Генерируем схемы с помощью npx graphql-codegen
        npx graphql-codegen --config codegen.yaml
        
        # Удаляем копию файла codegen.yaml после генерации
        rm codegen.yaml

        echo "Схемы успешно сгенерированы и файл codegen.yaml удален."
    else
        echo "Не удалось перейти в директорию $graphql_dir"
    fi
else
    echo "ГрафQL схемы не найдены."
fi
