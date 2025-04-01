'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { useCart } from '@/contexts/CartContext';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import Script from 'next/script';
import { useRouter, useSearchParams } from 'next/navigation';

interface ShippoRate {
  object_id: string;
  amount: string;
  currency: string;
  provider: string;
  servicelevel: any;
  estimated_days: number;
  duration_terms: string;
  provider_image_75: string;
}

interface ShippoShipmentResponse {
  object_id: string;
  status: string;
  rates: ShippoRate[];
}

interface ShippingAddress {
  name: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function ShippingPage() {
  const { state } = useCart();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    name: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [shippingRates, setShippingRates] = useState<ShippoRate[]>([]);
  const [isRatesDialogOpen, setIsRatesDialogOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState<ShippoRate | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get shipping address from search params
  const shippingAddressParam = searchParams.get('shippingAddress');
  const shippingAddress = shippingAddressParam ? JSON.parse(decodeURIComponent(shippingAddressParam)) : null;

  useEffect(() => {
    if (window.google?.maps) {
      setIsGoogleLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (shippingAddress) {
      setAddress(shippingAddress);
    }
  }, [shippingAddress]);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'us' },
      types: ['address']
    },
    debounce: 300,
    cache: 86400,
  });

  const handleAddressSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results?.[0]) {
        const addressComponents = data.results[0].address_components;
        const streetNumber = addressComponents.find((c: any) => 
          c.types.includes('street_number'))?.long_name || '';
        const street = addressComponents.find((c: any) => 
          c.types.includes('route'))?.long_name || '';
        const city = addressComponents.find((c: any) => 
          c.types.includes('locality'))?.long_name || '';
        const state = addressComponents.find((c: any) => 
          c.types.includes('administrative_area_level_1'))?.short_name || '';
        const zipCode = addressComponents.find((c: any) => 
          c.types.includes('postal_code'))?.long_name || '';
        
        setAddress(prevAddress => ({
          ...prevAddress,
          street1: `${streetNumber} ${street}`.trim() || '',
          city: city || '',
          state: state || '',
          zipCode: zipCode || '',
          country: 'US',
        }));
      }
    } catch (error) {
      console.error('Error fetching address details:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingRates(true);

    try {
      const requestBody = {
        addressFrom: {
          name: "Your Store Name",
          street1: "10603 Southdown Trace Trl",
          street2: "228",
          city: "Houston",
          state: "TX",
          zip: "77034",
          country: "US"
        },
        addressTo: {
          name: address.name,
          street1: address.street1,
          street2: address.street2 || '',
          city: address.city,
          state: address.state,
          zip: address.zipCode,
          country: address.country
        },
        parcels: state.items.flatMap(item => {
          // Create an array of parcels based on the item quantity
          return Array(item.quantity).fill({
            length: item.length?.toString() || "5",
            width: item.width?.toString() || "5",
            height: item.height?.toString() || "5",
            distance_unit: "in",
            weight: item.weight?.toString() || "2",
            mass_unit: "lb"
          });
        })
      };

      console.log('Request body:', requestBody);

      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      // Log the raw response
      const rawResponse = await response.text();
      console.log('Raw response:', rawResponse);

      // Try to parse the response
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error(`Invalid JSON response: ${rawResponse.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate shipping rates');
      }

      setShippingRates(data.rates);
      setIsRatesDialogOpen(true);
    } catch (error) {
      console.error('Error calculating shipping rates:', error);
      alert(error instanceof Error ? error.message : 'Failed to calculate shipping rates');
    } finally {
      setIsLoadingRates(false);
    }
  };

  const handleRateSelection = (selectedRate: ShippoRate) => {
    // Encode the rate and address as URL parameters
    const params = new URLSearchParams({
      shippingRate: encodeURIComponent(JSON.stringify(selectedRate)),
      shippingAddress: encodeURIComponent(JSON.stringify(address))
    });
    
    router.push(`/checkout/summary?${params.toString()}`);
  };

  const ShippingRateDialog = () => (
    <Dialog 
      open={isRatesDialogOpen} 
      onClose={() => setIsRatesDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Choose Your Shipping Method</DialogTitle>
      <DialogContent>
        {isLoadingRates ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {shippingRates.map((rate) => (
              <Grid item xs={12} key={rate.object_id}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: selectedRate?.object_id === rate.object_id ? 2 : 1,
                    borderColor: selectedRate?.object_id === rate.object_id ? 'primary.main' : 'grey.300',
                  }}
                  onClick={() => setSelectedRate(rate)}
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <img 
                        src={rate.provider_image_75} 
                        alt={rate.provider} 
                        style={{ height: 40 }}
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle1">
                        {rate.provider} - ${rate.amount} {rate.currency}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estimated delivery: {rate.estimated_days} days
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rate.duration_terms}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsRatesDialogOpen(false)}>Back</Button>
        <Button 
          variant="contained" 
          disabled={!selectedRate}
          onClick={() => {
            handleRateSelection(selectedRate as ShippoRate);
          }}
        >
          Continue to Payment
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => setIsGoogleLoaded(true)}
      />
      
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Grid container spacing={3}>
          {/* Cart Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              {state.items.map((item) => (
                <Box key={item.id} sx={{ mb: 2 }}>
                  <Typography>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle1">
                  Subtotal: ${state.total.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Address Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Full Name"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  required
                  fullWidth
                />
                
                {/* Address Search - Not required */}
                <Autocomplete
                  freeSolo
                  options={data}
                  filterOptions={(x) => x}
                  autoComplete
                  includeInputInList
                  filterSelectedOptions
                  value={value}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      const addressValue = typeof newValue === 'string' 
                        ? newValue 
                        : newValue.description;
                      handleAddressSelect(addressValue);
                    }
                  }}
                  onInputChange={(_, newInputValue) => {
                    setValue(newInputValue);
                  }}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return option.description || '';
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search for your address (optional)"
                      fullWidth
                      helperText="Or fill in address details below"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      {option.description || option}
                    </li>
                  )}
                />

                {/* Required address fields */}
                <TextField
                  label="Street Address"
                  value={address.street1 || ''}
                  onChange={(e) => setAddress(prev => ({ ...prev, street1: e.target.value }))}
                  required
                  fullWidth
                  error={!address.street1}
                  helperText={!address.street1 ? "Street address is required" : ""}
                />

                <TextField
                  label="Apartment, suite, etc. (optional)"
                  value={address.street2 || ''}
                  onChange={(e) => setAddress(prev => ({ ...prev, street2: e.target.value }))}
                  fullWidth
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      value={address.city || ''}
                      onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      label="State"
                      value={address.state || ''}
                      onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      label="ZIP Code"
                      value={address.zipCode || ''}
                      onChange={(e) => setAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Country"
                  value="United States"
                  disabled
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Continue to Shipping Options
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <ShippingRateDialog />
    </>
  );
}
