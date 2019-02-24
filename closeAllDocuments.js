// Close all new files without prompt.
var openDocuments = UltraEdit.document;

openDocuments.forEach(function(item){
	UltraEdit.closeFile(item.path,2);
});
