import { NextResponse } from 'next/server';

// Add this at the top of the file to specify Edge runtime
export const runtime = 'nodejs';

// Define proper types for Shippo requests
interface ParcelCreateRequest {
  length: string;
  width: string;
  height: string;
  distance_unit: 'in' | 'cm';
  weight: string;
  mass_unit: 'lb' | 'kg';
}

interface AddressCreateRequest {
  name: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface ShipmentCreateRequest {
  address_from: AddressCreateRequest;
  address_to: AddressCreateRequest;
  parcels: ParcelCreateRequest[];
  async: boolean;
}

export async function POST(request: Request) {
  try {
    console.log('API route handler started');

    const body = await request.json();
    console.log('Received request body:', body);

    if (!body.addressFrom || !body.addressTo || !body.parcels) {
      return NextResponse.json(
        { error: 'Missing required fields in request body' },
        { status: 400 }
      );
    }

    try {
      // Format the request for Shippo's REST API
      const shipmentRequest: ShipmentCreateRequest = {
        address_from: {
          name: body.addressFrom.name,
          street1: body.addressFrom.street1,
          city: body.addressFrom.city,
          state: body.addressFrom.state,
          zip: body.addressFrom.zip,
          country: body.addressFrom.country || 'US'
        },
        address_to: {
          name: body.addressTo.name,
          street1: body.addressTo.street1,
          city: body.addressTo.city,
          state: body.addressTo.state,
          zip: body.addressTo.zip,
          country: body.addressTo.country || 'US'
        },
        parcels: body.parcels.map((parcel: any) => ({
          length: parcel.length || "5",
          width: parcel.width || "5",
          height: parcel.height || "5",
          distance_unit: "in",
          weight: parcel.weight || "2",
          mass_unit: "lb"
        })),
        async: false
      };

      console.log('Shippo request:', shipmentRequest);

      // Make direct REST API call to Shippo
      const response = await fetch('https://api.goshippo.com/shipments/', {
        method: 'POST',
        headers: {
          'Authorization': `ShippoToken ${process.env.SHIPPO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shipmentRequest)
      });

      const shipment = await response.json();

      if (!response.ok) {
        throw new Error(`Shippo API error: ${JSON.stringify(shipment)}`);
      }

      console.log('Shippo response:', shipment);

      if (!shipment.rates || shipment.rates.length === 0) {
        throw new Error('No shipping rates available');
      }

      return NextResponse.json({
        status: 'success',
        shipment_id: shipment.object_id,
        rates: shipment.rates
      });

    } catch (shippoError) {
      console.error('Shippo API error:', shippoError);
      return NextResponse.json(
        { 
          error: 'Shippo API error', 
          details: shippoError instanceof Error ? shippoError.message : 'Unknown error',
          stack: shippoError instanceof Error ? shippoError.stack : undefined
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}