production=1

if [ $production -eq 1 ]; then
  echo "Production mode";
  npm install;
  rm -rf dist;
  npm run build;
  # sleep 5;  # wait for 5 seconds
  # tar -czvf backend.tar.gz ./;
  npm run start;
else
  echo "Development mode"
  npm run dev
fi;