echo "cleaning up"
rm -rf docs

echo "Create docs directory"
mkdir -p docs

echo "Copy assets"
cp -r assets/* docs

echo "Build the thing"
node build

echo "Wanna open it? $(pwd)/docs/index.html"
