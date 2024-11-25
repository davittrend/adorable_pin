import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface ScheduledPin {
  id: string;
  accountId: string;
  boardId: string;
  boardName: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  scheduledFor: string;
}

interface PinState {
  scheduledPins: ScheduledPin[];
  addScheduledPin: (pin: Omit<ScheduledPin, 'id'>) => void;
  addScheduledPins: (pins: Omit<ScheduledPin, 'id'>[]) => void;
  removeScheduledPin: (pinId: string) => void;
  getScheduledPinsByAccount: (accountId: string) => ScheduledPin[];
  publishPin: (pinId: string) => Promise<void>;
}

const usePinStore = create<PinState>()(
  persist(
    (set, get) => ({
      scheduledPins: [],
      
      addScheduledPin: (pin) => set((state) => ({
        scheduledPins: [...state.scheduledPins, { ...pin, id: uuidv4() }]
      })),
      
      addScheduledPins: (pins) => set((state) => ({
        scheduledPins: [
          ...state.scheduledPins,
          ...pins.map(pin => ({ ...pin, id: uuidv4() }))
        ]
      })),
      
      removeScheduledPin: (pinId) => set((state) => ({
        scheduledPins: state.scheduledPins.filter(pin => pin.id !== pinId)
      })),
      
      getScheduledPinsByAccount: (accountId) => {
        return get().scheduledPins.filter(pin => pin.accountId === accountId);
      },
      
      publishPin: async (pinId) => {
        const pin = get().scheduledPins.find(p => p.id === pinId);
        if (!pin) return;
        
        // TODO: Implement Pinterest API call to publish pin
        // For now, just remove it from scheduled pins
        get().removeScheduledPin(pinId);
      }
    }),
    {
      name: 'pinterest-pins'
    }
  )
);

export default usePinStore;