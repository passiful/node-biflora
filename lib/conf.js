/**
 * conf
 */
(function(exports){

	var fs = require('fs');
	var path = require('path');
	var php = require('phpjs');
	var baseDir = (function(){
		if(fs.existsSync(__dirname+'/../../../package.json')){
			return path.resolve(__dirname, '../../../');
		}
		return path.resolve(__dirname, '../');
	})();
	var packageJson = require( baseDir + '/package.json' );
	var conf = packageJson.bifloraConfig;

    conf.defaultPort = conf.defaultPort||8080;
    conf.frontendDocumentRoot = conf.frontendDocumentRoot||false;
    if(conf.frontendDocumentRoot){ conf.frontendDocumentRoot = path.resolve(baseDir+'/'+conf.frontendDocumentRoot)+'/'; }
    conf.backendJs = conf.backendJs||false;
    if(conf.backendJs){ conf.backendJs = path.resolve(baseDir+'/'+conf.backendJs); }
    conf.backendApis = conf.backendApis||false;
    if(conf.backendApis){ conf.backendApis = path.resolve(baseDir+'/'+conf.backendApis)+'/'; }

    exports.get = function(){
        return conf;
    }

})(module.exports);
