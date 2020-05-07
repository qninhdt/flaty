const fs = require("fs")
const path = require("path")
const YAML = require("yaml")

// load config
const config = YAML.parse(fs.readFileSync("./config.yml", "utf8"))

// plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = ({ NODE_ENV }) => {

    const isDevelopment = NODE_ENV == "development"

    const devConfig = {
        devServer: {
            contentBase:[
                path.join(__dirname, config.output.path),
                path.join(__dirname, config.serve.example)
            ],
            compress: true,
            port: config.serve.port
        },
        devtool: 'inline-source-map',
    }

    const styleRules = [

        {
            test: /\.module\.s(a|c)ss$/,
            loader: [   
                // css
                isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
                {
                    loader: "css-loader",
                    options: {
                        modules: true,
                        sourceMap: isDevelopment
                    }
                },
                // sass/scss
                {
                    loader: "sass-loader",
                    options: {
                        sourceMap: isDevelopment
                    }
                }
            ]
        },
        {
            test:/\.css$/,
            loader: [
                isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
                {
                    loader: "css-loader",
                    options: {
                        sourceMap: isDevelopment
                    }
                },
            ]
        },
        {
            test: /\.s(a|c)ss$/,
            exclude: /\.module.s(c|a)ss$/,
            loader: [   
                // css
                isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
                {
                    loader: "css-loader",
                    options: {
                        sourceMap: isDevelopment
                    }
                },
                // sass/scss
                {
                    loader: "sass-loader",
                    options: {
                        sourceMap: isDevelopment
                    }
                }
            ]
        }
    ]

    const fileRules = [
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }
            ]
        }
    ]

    return {
        
        entry: config.entry,

        mode: NODE_ENV,

        module: {
            rules: [
                ...styleRules,
                ...fileRules
            ]
        },

        output: {
            filename: config.output.js,
            path: path.resolve(__dirname, config.output.path)
        },

        resolve: {
            extensions: [".js", ".css", ".scss"]
        },

        ...(isDevelopment ? devConfig : {})
    }
}