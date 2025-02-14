import React, { useState } from 'react';
import { Button } from '@mui/material';
import LoginDialogWindow from '../../app/components/LoginDialogWindow';

const TestPage = () => {

    const [openAuthDialog, setOpenAuthDialog] = useState(false);

    const handleOpenAuthDialog = () => setOpenAuthDialog(!openAuthDialog);

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAuthDialog}
            >
                Войти
            </Button>
        </div>
    );
};

export default TestPage;
