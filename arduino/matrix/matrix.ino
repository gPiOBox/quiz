/* During initiation, be sure to send every part to every max7219 and then
upload it.
For example, if you have five max7219's, you have to send the scanLimit 5 times
before you load it-- other wise not every max7219 will get the data. The
function maxInUse keeps track of this, just tell it how many max7219 you are
using.
*/
 
// Added By LKPridgeon
int matrix_buffer[] {255,255,255,255,255};
int charList[256];
int matrix_populate_delay = 0;
int matrix_update_delay = 500;
int updates_per_second = 2;
 
 
// Sloppy stuff that just 'works'
int dataIn = 7;
int load = 6;
int clock = 5;
int mx = 1; //current display
int maxInUse = 5; //change this variable to set how many MAX7219's you'll use so 3 boards = 3
int e = 0; // just a varialble
int D;
int TeamA_Score=75;
int MOD;
int MOD1;
int FirstRead = 1;
int Seg_map[] { 119, 68, 107, 109, 92, 61, 63, 100, 255, 125 };   // Maps 0-9 to required pattern
// define max7219 registers
byte max7219_reg_noop = 0x00;
byte max7219_reg_digit0 = 0x01;
byte max7219_reg_digit1 = 0x02;
byte max7219_reg_digit2 = 0x03;
byte max7219_reg_digit3 = 0x04;
byte max7219_reg_digit4 = 0x05;
byte max7219_reg_digit5 = 0x06;
byte max7219_reg_digit6 = 0x07;
byte max7219_reg_digit7 = 0x08;
byte max7219_reg_decodeMode = 0x09;
byte max7219_reg_intensity = 0x0a;
byte max7219_reg_scanLimit = 0x0b;
byte max7219_reg_shutdown = 0x0c;
byte max7219_reg_displayTest = 0x0f;
void putByte(byte data) {
byte i = 8;
byte mask;
while (i > 0) {
mask = 0x01 << (i - 1); // get bitmask
digitalWrite( clock, LOW); // tick
if (data & mask) { // choose bit
digitalWrite(dataIn, HIGH);// send 1
} else {
digitalWrite(dataIn, LOW); // send 0
}
digitalWrite(clock, HIGH); // tock
--i; // move to lesser bit
}
}
void maxSingle( byte reg, byte col) {
//maxSingle is the "easy" function to use for a //single max7219
digitalWrite(load, LOW); // begin
putByte(reg); // specify register
putByte(col);//((data & 0x01) * 256) + data >> 1); // put data
// and load da shit
digitalWrite(load, HIGH);
}
void maxAll (byte reg, byte col) { // initialize all MAX7219's in the system
int c = 0;
digitalWrite(load, LOW); // begin
for ( c = 1; c <= maxInUse; c++) {
putByte(reg); // specify register
putByte(col);//((data & 0x01) * 256) + data >> 1); // put data
}
digitalWrite(load, HIGH);
}
void maxOne(byte maxNr, byte reg, byte col) {
//maxOne is for adressing different MAX7219's,
//whilele having a couple of them cascaded
int c = 0;
digitalWrite(load, LOW); // begin
for ( c = maxInUse; c > maxNr; c--) {
putByte(0); // means no operation
putByte(0); // means no operation
}
putByte(reg); // specify register
putByte(col);//((data & 0x01) * 256) + data >> 1); // put data
for ( c = maxNr - 1; c >= 1; c--) {
putByte(0); // means no operation
putByte(0); // means no operation
}
digitalWrite(load, HIGH);
}
void setup () {
  pinMode(dataIn, OUTPUT);
  pinMode(clock, OUTPUT);
  pinMode(load, OUTPUT);
  Serial.begin(115200);
  Serial.flush();
  digitalWrite(clock, HIGH);
  //initiation of the max 7219
  maxAll(max7219_reg_scanLimit, 0x07);
  maxAll(max7219_reg_decodeMode, 0x00); // using an led matrix (not digits)
  maxAll(max7219_reg_shutdown, 0x01); // not in shutdown mode
  maxAll(max7219_reg_displayTest, 0x00); // no display test
  for (e = 1; e <= 8; e++) { // empty registers, turn all LEDs off
    maxAll(e, 0);
  }
  maxAll(max7219_reg_intensity, 0x0f & 0x0f); // the first 0x0f value you can set to alter brightness
  // range: 0x00 to 0x0f
 
  createCharList();
}
 
void createCharList(){
  charList[48]  = 119; //0
  charList[49]  =  68; //1
  charList[50]  = 107; //2
  charList[51]  = 109; //3
  charList[52]  =  92; //4
  charList[53]  =  61; //5
  charList[54]  =  63; //6
  charList[55]  = 100; //7
  charList[56]  = 255; //8
  charList[57]  = 125; //9
  charList[45]  =   8; //-
  charList[71]  = 125; //g
  charList[103] = 125;
  charList[80]  = 122; //p
  charList[112] = 122;
  charList[73]  = 256; //Special Case for lower case i
  charList[105] = 256;
  charList[79]  = 119; //o
  charList[111] = 119;
  charList[76]  =  19; //l
  charList[108] =  19;
  charList[85]  =   7; //u
  charList[117] =   7;
  charList[84]  =  27; //t
  charList[116] =  27;
  charList[67]  =  51; //c
  charList[99]  =  51;
  charList[83]  =  61; //s
  charList[115] =  61;
  charList[82]  =  10; //r
  charList[114] =  10;
  charList[72]  =  30; //h
  charList[104] =  30;
  charList[69]  =  59; //e
  charList[101] =  59;
  charList[65]  = 126; //a
  charList[97]  = 126;
  charList[88]  = 256; //Special Case for Do Not Update
  charList[32]  =   0; //Blank
  charList[110]  =   0; //Blank
  charList[33]  = 256; //Special Case for !
  charList[63]  = 256; //Special Case for ?
}
 
// Matrix(mx) details 1=TeamA units,2=TeamA Tens,3=TeamB units,4=TeamB Tens
void loop () {
  LED(D); // Write Out
 
  /*for (int i; i<maxInUse; i++){
    for(int j; j<8; j++){
      maxOne((maxInUse-i), j, matrix_buffer[i]);
    }
  } */
 
  delay (1000/updates_per_second);
}
 
 
void LED(int D){
  getChar();
  Serial.flush();
}
 
void getChar() {
  if (Serial.available()){
    while (Serial.available()){
      char data[0];
      Serial.readBytes(data, maxInUse);
      data[maxInUse] = 0; // Bad way to remove overflow
      Serial.println(data);
      //Serial.println(maxInUse);
      for (int i=0; i<maxInUse; i++){
        //Serial.println("It:" + i);
        if(charList[data[i]] != 256){
          for(int t1=0; t1<8; t1++){
            maxOne((maxInUse-i), t1, charList[data[i]]);
          }
        }
        else
        {
          specialCase(data[i], (maxInUse-i));
        }
        //Serial.println(charList[data[i]]);
       
        delay (matrix_populate_delay);
      }
     
      delay (matrix_update_delay);
    }
  }
}
 
 
void specialCase(int data, int DID){
  switch (data)  {
    case 67:
      generateI(DID);
      break;
    case 105:
      generateI(DID);    
      break;
    case 33:
      generateEMark(DID);
      break;
    case 63:
      generateQMark(DID);
      break;
    case 88:
      break;
    case 120:
      break;
    default:
      break;
  }
}
 
void generateI(int DID){
  maxOne(DID, 1, 4); // mx=current matrix, D=Pattern Match for Digit to be LIT
  maxOne(DID, 2, 4);
  maxOne(DID, 3, 68);
  maxOne(DID, 4, 4);
  maxOne(DID, 5, 4);
  maxOne(DID, 6, 4);
  maxOne(DID, 7, 4);
  //Serial.println("Generating lower case i");
}
 
void generateEMark(int DID){
  maxOne(DID, 1, 68);
  maxOne(DID, 2, 64);
  maxOne(DID, 3, 68);
  maxOne(DID, 4, 68);
  maxOne(DID, 5, 68);
  maxOne(DID, 6, 68);
  maxOne(DID, 7, 68);
}
 
void generateQMark(int DID){
  maxOne(DID, 1, 106);
  maxOne(DID, 2, 106);
  maxOne(DID, 3, 106);
  maxOne(DID, 4, 106);
  maxOne(DID, 5, 104);
  maxOne(DID, 6, 106);
  maxOne(DID, 7, 106);
}
