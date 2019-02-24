// -----------------------------------------------------------------------------------
// Script:
// - OpenClose.js (script meant to be included)
//
// Purpose:
// - Script taking into account selected text and works in columnmode
//   to insert closing "<'{( e.g. type [ and ] is automatically inserted as well.
//   See Rules below.
//
// Author / UE forum thread:
// - hugov
// - https://www.ultraedit.com/forums/viewtopic.php?f=52&t=16787
//
// History:
// - v1.1 UE v25.00.0.53 now supports UltraEdit.activeDocument.currentLineNum again (March 2018)
// - v1.0 first version
//
// Follows these rules:
// - Normal mode: if caret is at an empty space (including start/end of line) -> write the closing character
// - Normal mode: if caret is at a non-empty space only write opening-character
// - Normal mode: if something is selected -> wrap selection in opening- and closing-characters
// - Column mode: if nothing is selected -> insert opening- and closing-characters
// - Column mode: if something is selected on ONE line -> wrap selection in opening- and closing-characters
// as of v1.1:
// - Column mode: if something is selected on Multiple lines -> wrap selection in in opening- and closing-characters,
//   place caret just before close character so you can continue typing in column mode :-)
//
// - v1.0 behaviour (code in forum thread):
// - Column mode: if something is selected on Multiple lines -> remove selection and write opening- and closing-characters
//                this is where the problems begin, it should be possible to wrap selection and stay in column mode (see TODO)
//
// Usage:
// - Create one or more scripts as shown below, one for each of the open/closing combinations
//   you would like to use so for " ' [ < { ( or other characters
// - Assign a hotkey to the script, for [ assigning [ as a hotkey will work,
//   for " use shift+' etc
//
// -[start of script]------------------------
// var openchar = "[";
// var closechar = "]";
//
// // include OpenClose.js
// -[end of script  ]------------------------
//
// -----------------------------------------------------------------------------------

if (UltraEdit.document.length > 0) // returns number of active documents
  {
   if (UltraEdit.columnMode == false) // check if we're if columnmode, if not proceed
     {
      UltraEdit.insertMode();
      if (UltraEdit.activeDocument.isSel()) // if something is selected just wrap it and we're done
        {
         UltraEdit.activeDocument.write(openchar + UltraEdit.activeDocument.selection + closechar);
        }
      else
        {
         CheckChar();
        }
     }
   else // column mode == true
     {
       if (UltraEdit.activeDocument.isSel()) // multiple lines - not always correct
         {
         UltraEdit.selectClipboard(1);
         UltraEdit.activeDocument.copy(); // inefficient method of trying to determine number of selected lines
         var ctext = UltraEdit.clipboardContent;
         var c = ctext.split("\n");
         var columnlength = c[1].length-1;
         if (c.length > 1)
            {
            var CopyWrappedText = "";
            var arrayLength = c.length-1;
            for (var i = 0; i < arrayLength; i++) {
                CopyWrappedText += openchar + c[i].trim() + closechar + "\n";
            }
            UltraEdit.clipboardContent = CopyWrappedText;
            UltraEdit.activeDocument.paste();
            // currentLineNum will always be the TOP line of the selection after paste so we can use that
            // combined with the height of the selection (arrayLength) to figure out how many lines to move down
            var LineNumTop = UltraEdit.activeDocument.currentLineNum; // UltraEdit v25.00.0.53 works again - see forum thread
            var LineNumBottom = LineNumTop + arrayLength - 1;
            var EndColumn = UltraEdit.activeDocument.currentColumnNum + columnlength + 1;
            UltraEdit.activeDocument.gotoLine(LineNumTop,EndColumn);
            UltraEdit.activeDocument.startSelect();
            var x=0;
            while (x < arrayLength-1) {
                 UltraEdit.activeDocument.key("DOWN ARROW");
                 x++;
              }
            UltraEdit.activeDocument.endSelect();
           }
         else
            {
            UltraEdit.activeDocument.write(openchar + ctext + closechar);
            }
          UltraEdit.selectClipboard(0);
         }
       else // for single line use write otherwise open + close will be inserted in all lines below current line as well
         {
         CheckChar();
         }
     }
  UltraEdit.selectClipboard(0);
  }

function CheckChar() {
  var char = UltraEdit.activeDocument.currentChar; // if current character isn't empty (space or end of line) just write with closing char
  if (!char.trim().length)
    {
     UltraEdit.activeDocument.write(openchar + closechar);
     UltraEdit.activeDocument.key("LEFT ARROW");
     UltraEdit.activeDocument.cancelSelect();
    }
  else // current char wasn't empty so just write opening char
    {
     UltraEdit.activeDocument.write(openchar);
    }
}