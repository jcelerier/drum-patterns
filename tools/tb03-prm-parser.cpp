#include <ctre.hpp>

#include <charconv>
#include <fstream>
#include <iostream>
#include <set>
#include <vector>

// input
static constexpr auto regex = ctll::fixed_string{
    R"(STATE=([0-9]+)\s*NOTE=([0-9]+)\s*ACCENT=([0-9]+)\s*SLIDE=([0-9]+))"};
struct parsed_line
{
  int state;
  int note;
  int accent;
  int slide;
};

// output
struct pattern
{
  struct row
  {
    int note;
    std::vector<char> notes;
  };
  std::vector<row> rows;
};

int main(int argc, char** argv)
{
  std::vector<parsed_line> lines;
  std::set<int, std::greater<>> notes;

  if(auto file = std::ifstream(argv[1]); file.is_open())
  {
    std::string line;
    while(std::getline(file, line))
    {
      if(auto m = ctre::match<regex>(line))
      {
        int state = std::stoi(std::string(m.get<1>()));
        int note = std::stoi(std::string(m.get<2>()));
        int accent = std::stoi(std::string(m.get<3>()));
        int slide = std::stoi(std::string(m.get<4>()));
        notes.insert(note);

        lines.push_back(parsed_line{state, note, accent, slide});
      }
      else
      {
        std::cerr << " No match ! " << line << "\n";
        return 1;
      }
    }
  }

  const int N = lines.size();
  pattern out;
  out.rows.reserve(notes.size() + 2);
  for(int note : notes)
  {
    pattern::row r;
    r.note = note;
    r.notes.resize(N, '-');
    out.rows.push_back(r);
  }
  // accent
  out.rows.push_back({-1, std::vector<char>(N, '-')});
  auto& accent = out.rows.back().notes;
  // slide
  out.rows.push_back({-2, std::vector<char>(N, '-')});
  auto& slide = out.rows.back().notes;

  for(int i = 0; i < lines.size(); i++)
  {
    for(auto& row : out.rows)
    {
      if(lines[i].note == row.note)
      {
        row.notes[i] = lines[i].state + '0';
        break;
      }
    }
    if(lines[i].accent)
      accent[i] = 'x';
    if(lines[i].slide)
      slide[i] = 'x';
  }

  for(auto& row : out.rows)
  {
    switch(row.note)
    {
      case -1:
        std::cout << "AC ";
        break;
      case -2:
        std::cout << "SL ";
        break;
      default:
        std::cout << row.note << " ";
        break;
    }

    for(char n : row.notes)
      std::cout << n;

    std::cout << std::endl;
  }
}