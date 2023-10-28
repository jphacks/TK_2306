import React from 'react';
import DialogTitle from '@mui/material/DialogTitle'; // DialogTitleをインポート
import DialogContent from '@mui/material/DialogContent'; // DialogContentをインポート
import DialogActions from '@mui/material/DialogActions'; // DialogActionsをインポート
import Button from '@mui/material/Button'; // Buttonをインポート// PopupContent.js

function PopupContent({onClose}) {
  return (
    <div>
      <DialogTitle>ポップアップタイトル</DialogTitle>
      <DialogContent>
        <p>ポップアップのコンテンツ</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          閉じる
        </Button>
      </DialogActions>
    </div>
  );
}

export default PopupContent;
