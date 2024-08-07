'use client';

import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material';
import { collection, getDocs, query, getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [started, setStarted] = useState(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(), 
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const trimmedItem = item.trim();
    const docRef = doc(collection(firestore, 'inventory'), trimmedItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    if (started) {
      updateInventory();
    }
  }, [started]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!started) {
    return (
      <Box 
        width="100vw" 
        height="100vh" 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center"
        gap={2}
      >
        <Typography variant="h2" color="#333">Inventory Manager</Typography>
        <Button variant="contained" onClick={() => setStarted(true)}>Get Started</Button>
      </Box>
    );
  }

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Add item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant='outlined'
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      {inventory.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Button variant='contained' onClick={handleOpen}>
            Start Adding Items
          </Button>
        </Box>
      ) : (
        <Box display="flex" width="100%" height="100%">
          <Box width="50%" border='1px solid #333' overflow="auto">
            <Box width='100%' height='100px' display="flex" bgcolor="#ADD8E6" alignItems="center" justifyContent="center">
              <Typography variant='h2' color='#333'>Inventory</Typography>
            </Box>
            <Stack width="100%" height="calc(100% - 100px)" spacing={2} overflow="auto" padding={2}>
              {
                inventory.map(({ name, quantity }) => (
                  <Box key={name} width='100%' minHeight='150px' display='flex' alignItems='center' justifyContent='space-between' bgcolor='#f0f0f0' padding={5}>
                    <Typography variant='h3' color='#333' textAlign='center'>
                      {name.charAt(0).toUpperCase() + name.slice(1)} 
                    </Typography>
                    <Typography variant='h3' color='#333' textAlign='center'>
                      {quantity}
                    </Typography>
                    <Button variant='contained' onClick={() => removeItem(name)}> Remove</Button>
                  </Box>
                ))
              }
            </Stack>
          </Box>
          <Box width="50%" display="flex" justifyContent="center" alignItems="center">
            <Button variant='contained' onClick={handleOpen}>
              Add New Item
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
