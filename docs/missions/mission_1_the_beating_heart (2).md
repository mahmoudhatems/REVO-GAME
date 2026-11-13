# Mission 1: The Beating Heart (Solar Power Station)

## 1. Global HUD (Heads-Up Display) Components

### Time Tracker

A countdown prominently displaying **"10 Days Left"** (`remaining_days`
initialized at 10).

### Battery Meter

A segmented battery icon with 10 visual bars. It starts half-full at
5/10 bars (`battery_current`: 25 kWh out of 50 kWh).

### Water Meter

A segmented water-drop icon showing 10/10 bars (`water_current`: 300
Liters).

### Passive Drain Indicator

A subtle glowing **-1** next to the battery meter, representing the base
computer's constant load (`base_load`: 5 kWh/sol).

## 2. Screen 1: The Briefing (Indoor UI)

**Background Visual:** Rivo standing inside the dark, unpowered Central
Command Dome.

**Character Avatar (Neil):** An animated AI companion face pops up with
a text bubble.

**Dialogue Box (Neil):**

> "Rivo, the base is a cold piece of metal right now. Without
> electricity, we can't generate air or turn on the heaters. You have
> exactly 10 days to set up everything. How many days will you invest in
> deploying the solar panels?"

**Call-to-Action (CTA) Button:** A large, glowing button labeled
**"Deploy Robot to Surface 🚀"**.

## 3. Screen 2: The Decision Interface (Outdoor UI)

**Background Visual:** The Mars surface in Jezero Crater with a dusty
orange sky and closed solar panel crates.

### Interactive Modal (The Decision Cards)

Four selectable cards appear on the screen. Each card visually
represents the trade-off between time spent and power gained.

  --------------------------------------------------------------------------
  UI Card        Card 1:        Card 2: Basic  Card 3: Medium Card 4: Giant
  Element        Emergency Grid Grid           Grid           Grid
  -------------- -------------- -------------- -------------- --------------
  **Visual       1 Small Panel  2 Panels       3 Panels       4 Massive
  Icon**                                                      Panels

  **Cost         -1 Day ⏱️      -2 Days ⏱️     -3 Days ⏱️     -4 Days ⏱️
  (Time)**                                                    

  **Reward       +6 Power       +12 Power      +18 Power      +24 Power
  (Power)**      Bars/Day ⚡    Bars/Day ⚡    Bars/Day ⚡    Bars/Day ⚡

  **Hidden UX    Base will      No luxury to   Pressures time Abandons the
  Risk**         freeze during  run heavy      for building   greenhouse
                 storms         machines       the shield     entirely
  --------------------------------------------------------------------------

## 4. Screen 3: Feedback & Day End (Result UI)

### Animation Trigger

Upon selecting a card, the robot rapidly unpacks the panels, and the
base lights up.

### HUD Update Animation

-   The **Days Left** counter decreases based on the selection (e.g.,
    from 10 to 8).
-   The **Battery Meter** animates and fills up.

### UX Alert (Dust Warning)

Neil pops up with a crucial hint for the player:

> "Mars dust acts like dirt on a phone screen; every day without
> cleaning, it steals our electricity. NASA's Opportunity rover died
> here for the same reason!"

This foreshadows the **0.3% daily decay mechanic**.

### Logbook Notification

A flashing icon on Rivo's Notebook indicates a new automatic entry
recording the daily power supply.

### End Phase CTA

A button appears labeled **"Go to Sleep Pod 🛌"**, which transitions the
screen to black and loads Mission 2.
